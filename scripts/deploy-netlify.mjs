/**
 * Déploiement du site statique vers Netlify via l'API par empreintes.
 *
 * Pourquoi ne pas utiliser l'API « zip » : sur cette plateforme, elle convertit
 * les séparateurs de chemin en antislashs et crée des fichiers nommés
 * littéralement `fr\index.html` à la racine. Résultat : tous les sous-dossiers
 * renvoient 404. L'API par empreintes laisse contrôler les chemins exacts.
 *
 * Principe :
 *   1. calculer le SHA-1 de chaque fichier de dist/
 *   2. annoncer le manifeste à Netlify
 *   3. Netlify répond la liste des empreintes qu'il ne possède pas encore
 *   4. téléverser uniquement celles-là
 *   5. attendre que le déploiement passe en « ready »
 *
 * Netlify conserve les fichiers par empreinte : un redéploiement ne renvoie
 * que ce qui a changé.
 *
 * Ne déploie QUE le statique. Les fonctions serverless (netlify/functions/)
 * ne sont pas prises en charge ici : leur routage par `config.path` est résolu
 * par le système de build. Le proxy OAuth nécessite donc l'intégration Git ou
 * un déploiement par la CLI Netlify.
 *
 * Usage :
 *   NETLIFY_AUTH_TOKEN=xxx NETLIFY_SITE_ID=yyy node scripts/deploy-netlify.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const SITE_ID = process.env.NETLIFY_SITE_ID;
const API = 'https://api.netlify.com/api/v1';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(root, process.env.DEPLOY_DIR || 'dist');

if (!TOKEN || !SITE_ID) {
  console.error('NETLIFY_AUTH_TOKEN et NETLIFY_SITE_ID sont requis.');
  process.exit(1);
}

// --- Collecte du manifeste ------------------------------------------------

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const localFiles = walk(DIST);
const manifest = {};
const bySha = new Map();

for (const path of localFiles) {
  // Toujours des slashs, quelle que soit la plateforme : c'est ce que Netlify attend.
  const remote = '/' + relative(DIST, path).split(/[\\/]/).join('/');
  const buffer = readFileSync(path);
  const sha = createHash('sha1').update(buffer).digest('hex');
  manifest[remote] = sha;
  if (!bySha.has(sha)) bySha.set(sha, { buffer, path: remote });
}

console.log(`[deploy] ${localFiles.length} fichiers, manifeste construit`);

// --- Creation du deploiement ----------------------------------------------

const createResponse = await fetch(`${API}/sites/${SITE_ID}/deploys`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ files: manifest }),
});

if (!createResponse.ok) {
  console.error('[deploy] creation refusee :', createResponse.status, await createResponse.text());
  process.exit(1);
}

const deploy = await createResponse.json();
console.log(`[deploy] id ${deploy.id} — etat initial : ${deploy.state}`);
console.log(`[deploy] url de test : ${deploy.deploy_ssl_url || deploy.deploy_url}`);

// --- Televersement des fichiers manquants ---------------------------------

const required = Array.isArray(deploy.required) ? deploy.required : [];
console.log(`[deploy] ${required.length} fichier(s) a televerser`);

let uploaded = 0;
let failed = 0;
const CONCURRENCY = 8;

async function upload(sha) {
  const entry = bySha.get(sha);
  if (!entry) {
    console.error(`[deploy] empreinte inconnue : ${sha}`);
    failed += 1;
    return;
  }
  const response = await fetch(`${API}/deploys/${deploy.id}/files${entry.path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
    body: entry.buffer,
  });
  if (!response.ok) {
    console.error(`[deploy] echec ${entry.path} -> ${response.status}`);
    failed += 1;
    return;
  }
  uploaded += 1;
  if (uploaded % 25 === 0) console.log(`[deploy]   ${uploaded}/${required.length}`);
}

for (let i = 0; i < required.length; i += CONCURRENCY) {
  await Promise.all(required.slice(i, i + CONCURRENCY).map(upload));
}

console.log(`[deploy] ${uploaded} televerse(s), ${failed} echec(s)`);

// --- Attente de la mise en ligne ------------------------------------------

for (let attempt = 1; attempt <= 30; attempt += 1) {
  await new Promise((r) => setTimeout(r, 4000));
  const response = await fetch(`${API}/deploys/${deploy.id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const current = await response.json();
  console.log(`[deploy] etat : ${current.state}`);
  if (current.state === 'ready') {
    console.log(`[deploy] EN LIGNE : ${current.ssl_url}`);
    process.exit(0);
  }
  if (current.state === 'error') {
    console.error('[deploy] erreur :', current.error_message);
    process.exit(1);
  }
}

console.error('[deploy] delai depasse');
process.exit(1);
