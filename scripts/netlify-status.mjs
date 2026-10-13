/**
 * Inspection d'un compte Netlify via l'API.
 *
 * Utilité : savoir ce qui existe réellement côté Netlify — quels sites, quel
 * dépôt est lié, pourquoi un déploiement a échoué, quelles variables
 * d'environnement sont définies. Complète les vérifications faites côté GitHub,
 * qui ne peuvent pas voir la configuration Netlify.
 *
 * Le jeton est lu dans NETLIFY_AUTH_TOKEN et n'est jamais écrit sur disque.
 * Les VALEURS des variables d'environnement ne sont jamais affichées : seuls
 * leurs noms le sont, pour éviter de faire fuiter un secret dans un terminal
 * ou un journal de build.
 *
 * Usage :
 *   NETLIFY_AUTH_TOKEN=xxx node scripts/netlify-status.mjs
 *   NETLIFY_AUTH_TOKEN=xxx node scripts/netlify-status.mjs --log   (journal des deploiements)
 */

const TOKEN = process.env.NETLIFY_AUTH_TOKEN;
const WITH_LOG = process.argv.includes('--log');
const API = 'https://api.netlify.com/api/v1';

if (!TOKEN) {
  console.error('NETLIFY_AUTH_TOKEN manquant.');
  console.error('Creation : https://app.netlify.com/user/applications#personal-access-tokens');
  process.exit(1);
}

async function api(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'User-Agent': 'act-free-ai-diagnostic' },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${path} -> HTTP ${response.status} ${body.slice(0, 200)}`);
  }
  return response.json();
}

function line(label, value) {
  if (value === undefined || value === null || value === '') return;
  console.log(`  ${label.padEnd(18)} ${value}`);
}

// ---------------------------------------------------------------------------

let accounts = [];
try {
  accounts = await api('/accounts');
} catch (error) {
  console.error('Impossible de lister les comptes :', error.message);
  process.exit(1);
}

console.log('=== COMPTES ===');
for (const account of accounts) {
  console.log(`- ${account.name}  (slug: ${account.slug}, id: ${account.id})`);
}

let sites = [];
try {
  sites = await api('/sites');
} catch (error) {
  console.error('Impossible de lister les sites :', error.message);
  process.exit(1);
}

console.log(`\n=== SITES (${sites.length}) ===`);
if (sites.length === 0) {
  console.log('  Aucun site sur ce compte.');
}

for (const site of sites) {
  console.log(`\n- ${site.name}`);
  line('id', site.id);
  line('url', site.ssl_url || site.url);
  line('custom_domain', site.custom_domain);
  line('state', site.state);
  line('published_deploy', site.published_deploy ? site.published_deploy.state : 'aucun');

  if (site.build_settings && site.build_settings.repo_url) {
    line('repo', site.build_settings.repo_url);
    line('branch', site.build_settings.repo_branch);
    line('provider', site.build_settings.provider);
    line('cmd', site.build_settings.cmd);
    line('dir', site.build_settings.dir);
  } else {
    line('repo', 'AUCUN DEPOT LIE');
  }

  // Déploiements
  let deploys = [];
  try {
    deploys = await api(`/sites/${site.id}/deploys?per_page=5`);
  } catch {
    console.log('  (deploiements illisibles)');
  }

  if (deploys.length) {
    console.log('  deploiements recents :');
    for (const deploy of deploys.slice(0, 5)) {
      const when = deploy.created_at ? deploy.created_at.replace('T', ' ').slice(0, 19) : '?';
      console.log(`    ${when}  ${String(deploy.state).padEnd(12)} ${deploy.context || ''} ${deploy.error_message ? '| ' + deploy.error_message : ''}`);
    }

    const failed = deploys.find((d) => d.state === 'error');
    if (WITH_LOG && failed) {
      console.log(`\n  --- journal du deploiement echoue ${failed.id} ---`);
      try {
        const detail = await api(`/deploys/${failed.id}`);
        const url = detail.log_access_attributes && detail.log_access_attributes.url;
        if (url) {
          const response = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
          const text = await response.text();
          console.log(text.split('\n').slice(-60).join('\n'));
        } else {
          console.log('  (pas d URL de journal)');
        }
      } catch (error) {
        console.log('  journal illisible :', error.message);
      }
    }
  }

  // Variables d'environnement : noms uniquement.
  try {
    const env = await api(`/accounts/${site.account_id}/env?site_id=${site.id}`);
    const names = (env || []).map((v) => `${v.key}${v.is_secret ? ' (secret)' : ''}`);
    line('env vars', names.length ? names.join(', ') : 'aucune');
  } catch {
    line('env vars', 'illisibles');
  }
}

// Les 3 variables attendues par le proxy OAuth, sur le site lie au depot.
const target = sites.find(
  (s) => s.build_settings && (s.build_settings.repo_url || '').includes('act-free-ai')
);

console.log('\n=== SYNTHESE ===');
if (!target) {
  console.log('Aucun site n est lie au depot act-free-ai.');
  console.log('=> Le site a ete cree sans depot, ou le lien est casse.');
} else {
  console.log(`Site lie au depot : ${target.name} -> ${target.ssl_url || target.url}`);
  if (target.name !== 'act-free-ai') {
    console.log(`Le nom "${target.name}" n est pas "act-free-ai". Renommable via PATCH /sites/${target.id}.`);
  }
}
