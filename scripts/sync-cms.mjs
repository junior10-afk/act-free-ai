/**
 * Recopie le bundle de Decap CMS depuis node_modules vers public/admin/cms/.
 *
 * Pourquoi ne pas le charger depuis un CDN : un script d'administration chargé
 * depuis un domaine tiers est une dépendance de chaîne d'approvisionnement.
 * Si le CDN est compromis, du code arbitraire s'exécute sur la page qui a le
 * droit d'écrire dans le dépôt. En le servant nous-mêmes, la seule source
 * possible est ce dépôt, et la version est figée par package-lock.json.
 *
 * Le bundle découpe son code en morceaux chargés à la demande : on copie donc
 * tout le dossier dist, pas seulement le point d'entrée. Les source maps sont
 * écartées, elles ne servent qu'au débogage et pèsent 53 Mo.
 *
 * Lancé automatiquement par `npm run dev` et `npm run build` (hooks pre*).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const source = resolve(root, 'node_modules/decap-cms/dist');
const entry = join(source, 'decap-cms.js');
const target = resolve(root, 'public/admin/cms');

if (!existsSync(entry)) {
  console.error('[sync-cms] Bundle Decap CMS introuvable : ' + entry);
  console.error('[sync-cms] Lance « npm install » puis réessaie.');
  process.exit(1);
}

// Repartir d'un dossier propre évite de garder les morceaux d'une version
// précédente après une mise à jour.
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

cpSync(source, target, {
  recursive: true,
  filter: (from) => !from.endsWith('.map') && !from.endsWith('.LICENSE.txt'),
});

function measure(dir) {
  let files = 0;
  let bytes = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const info = statSync(path);
    if (info.isDirectory()) {
      const nested = measure(path);
      files += nested.files;
      bytes += nested.bytes;
    } else {
      files += 1;
      bytes += info.size;
    }
  }
  return { files, bytes };
}

const { files, bytes } = measure(target);
console.log(
  `[sync-cms] Decap CMS ${files} fichiers, ${(bytes / 1048576).toFixed(1)} Mo → public/admin/cms/`
);
