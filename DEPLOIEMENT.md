# Déploiement et maintenance d'Act-Free AI

Document de référence : ce qui est en ligne, comment ça fonctionne, comment
republier, et les pièges déjà rencontrés.

---

## 1. État actuel — tout est en ligne

| Élément | Valeur |
| --- | --- |
| **Site public** | <https://act-free-ai.netlify.app> |
| **Interface d'édition** | <https://act-free-ai.netlify.app/admin/> |
| **Dépôt** | <https://github.com/junior10-afk/act-free-ai> (public) |
| Site Netlify | id `2c8108fa-62b5-4ad6-8d20-fea1416648ff` |
| Compte Netlify | `junior10-afk` (team `6966c06ec3e89c105b1d1d41`) |
| Pages | 87, bilingues FR + EN |
| Déploiement | Automatique à chaque `push` sur `main` |

---

## 2. Architecture

```
GitHub (junior10-afk/act-free-ai)
        │  push sur main
        ▼
Netlify — build : npm run build
        │   ├─ prebuild → scripts/sync-cms.mjs  (copie Decap CMS dans public/)
        │   ├─ astro build  → dist/  (87 pages statiques)
        │   └─ netlify/functions/*.mjs  → proxy OAuth
        ▼
https://act-free-ai.netlify.app
        │
        ├─ /fr/ et /en/  →  site public
        ├─ /admin/       →  Decap CMS (édition)
        ├─ /auth         →  redirige vers GitHub
        └─ /callback     →  échange le code contre un jeton
```

**Pourquoi un proxy OAuth maison plutôt que Netlify Identity** : le proxy tourne
sur la même origine que le site, donc aucun service tiers ne voit jamais le
jeton GitHub. Le code est dans `netlify/functions/`, couvert par
`npm run test:oauth` (14 tests).

---

## 3. Publier du contenu

### Par l'interface web (recommandé)

1. <https://act-free-ai.netlify.app/admin/>
2. **Login with GitHub** → autorise l'application
3. Choisis une collection : Fournisseurs, Agents, Actualités
4. Crée ou modifie une fiche, enregistre

Chaque enregistrement crée un commit, ce qui déclenche un redéploiement
automatique. Le contenu est en ligne environ une minute plus tard.

Seuls les comptes GitHub ayant un **droit d'écriture** sur le dépôt peuvent
publier. Un visiteur qui se connecte obtient un jeton sans droit : GitHub
refuse l'écriture.

### En local

```bash
npm install
npm run cms     # Decap en local, sans OAuth
npm run dev     # dans un second terminal → http://localhost:4321/admin/
```

### Directement en Git

Le contenu vit dans `src/content/` : `providers/`, `agents/`, `news/`.
Un fichier Markdown par entrée, avec des champs suffixés `_fr` / `_en`.
Le schéma est validé par Zod dans `src/content.config.ts` — une entrée
invalide fait échouer le build.

---

## 4. Redéployer

**Automatique** : tout `push` sur `main`.

**Manuel** : Netlify → **Deploys** → **Trigger deploy** → *Clear cache and
deploy site*. Nécessaire après un changement de variable d'environnement.

**Déploiement local sans passer par Git** (dépannage) :

```bash
npm run build
NETLIFY_AUTH_TOKEN=xxx NETLIFY_SITE_ID=2c8108fa-62b5-4ad6-8d20-fea1416648ff \
  node scripts/deploy-netlify.mjs
```

`scripts/netlify-status.mjs` inspecte le compte (sites, dépôt lié,
déploiements, noms des variables d'environnement) :

```bash
NETLIFY_AUTH_TOKEN=xxx node scripts/netlify-status.mjs --log
```

---

## 5. Variables d'environnement

À définir dans Netlify → **Site configuration** → **Environment variables**.
Toutes avec le scope **Functions** au minimum.

| Variable | Valeur | Rôle |
| --- | --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | Client ID de l'OAuth App | identification auprès de GitHub |
| `GITHUB_OAUTH_CLIENT_SECRET` | Client secret | échange du code contre un jeton |
| `SITE_URL` | `https://act-free-ai.netlify.app` | fixe le `redirect_uri` |

`SITE_URL` est importante : sans elle, le `redirect_uri` serait déduit de l'URL
de la requête, et les déploiements de prévisualisation généreraient une adresse
de rappel différente que GitHub refuserait.

L'OAuth App est déclarée sur <https://github.com/settings/developers> avec :

- **Homepage URL** : `https://act-free-ai.netlify.app`
- **Authorization callback URL** : `https://act-free-ai.netlify.app/callback`

⚠️ L'URL de callback doit correspondre **au caractère près**, sans slash final,
sinon GitHub renvoie `redirect_uri_mismatch`.

---

## 6. Pièges déjà rencontrés

### L'app GitHub de Netlify doit avoir accès au dépôt

Symptôme : le build échoue à l'étape `preparing repo` avec

```
Host key verification failed.
fatal: Could not read from remote repository.
```

L'erreur est une erreur **SSH**, alors que Netlify clone en HTTPS — le message
induit en erreur. Un dépôt public et clonable anonymement peut échouer ainsi.

Cause : l'installation de l'app Netlify ne couvre pas le dépôt, typiquement
parce qu'elle a été faite en « Only select repositories » **avant** la création
du dépôt.

Correctif : <https://github.com/apps/netlify/installations/new> → autoriser
**All repositories** (ou ajouter le dépôt) → **Save**.

### Le déploiement par archive zip de l'API Netlify est inutilisable

Netlify convertit les séparateurs de chemin en **antislashs** : une archive
contenant `fr/index.html` produit un fichier littéralement nommé
`fr\index.html` à la racine. Résultat : la racine fonctionne, mais **tous les
sous-dossiers renvoient 404**.

Vérification : comparer `zipfile.namelist()` (slashs corrects) avec
`GET /api/v1/deploys/{id}/files` (antislashs).

Contournement : l'API par empreintes, implémentée dans
`scripts/deploy-netlify.mjs`.

### Un déploiement par API ne traite pas `netlify.toml`

En-têtes de sécurité, redirections et fonctions sont alors absents. Il faut un
déploiement par Git ou par la CLI Netlify.

### La racine `/` ne redirige pas en 301 — c'est volontaire

`src/pages/index.astro` est une page de détection de langue : elle lit
`navigator.language` et envoie vers `/fr/` ou `/en/`, avec repli
`<meta http-equiv="refresh">` et liens manuels. Ne pas « corriger » en
redirection figée : ce serait moins bon, car ça ignorerait la langue du
navigateur.

### Astro 7 : `params` n'est pas fusionné dans `Astro.props`

Il faut lire `Astro.params.lang`, pas `Astro.props.lang`.

---

## 7. Sécurité

| Risque | Traitement |
| --- | --- |
| Injection JSON via le comparateur | `safeJsonForScript()` échappe `<`, `>`, `&`, U+2028/29 |
| XSS dans les liens Markdown | le renderer n'accepte que `https?://` |
| Dépendance CDN tierce (Decap) | CMS auto-hébergé, servi en same-origin |
| Google Fonts appelé au runtime | polices auto-hébergées au build |
| `unsafe-inline` sur les scripts | CSP à hachages, `script-src` verrouillé |
| Secrets versionnés | aucun ; `.env` ignoré |
| Build non reproductible | `package-lock.json` suivi |
| CSRF sur le retour OAuth | `state` aléatoire (32 octets CSPRNG) + cookie `HttpOnly`/`Secure`/`SameSite=Lax`, comparé puis invalidé |
| Fuite du jeton vers une page tierce | la popup ne répond qu'à l'origine exacte du site |
| Élévation de portée OAuth | liste blanche de scopes ; `admin:org` retombe sur `repo` |
| XSS dans la page de retour | jeton sérialisé via `safeJson`, CSP à nonce |
| Jeton mis en cache par un proxy | `Cache-Control: no-store` sur `/auth` et `/callback` |
| Fuite du client secret | uniquement en variable d'environnement Netlify |

Ces éléments sont couverts par `npm run test:oauth` (14 tests).

**À savoir** : Netlify injecte un script `/.netlify/scripts/hud` dans toutes les
pages, y compris `/admin/`. Il est absent de nos sources. C'est l'hébergeur qui
l'ajoute — il pourrait de toute façon injecter ce qu'il veut — mais c'est à
garder en tête, la page d'administration manipulant un jeton GitHub.

---

## 8. Vérifications après mise en ligne

```bash
B=https://act-free-ai.netlify.app

# En-têtes de securite (7 attendus)
curl -sI $B/fr/ | grep -iE "strict-transport|content-type-options|referrer-policy|permissions-policy|cross-origin|x-frame"

# Admin exclu de l'indexation
curl -sI $B/admin/ | grep -i "x-robots-tag"

# CSP presente, script-src sans unsafe-inline
curl -s $B/fr/ | grep -o 'content-security-policy[^>]*' | head -c 200

# Le proxy OAuth redirige vers GitHub avec un state
curl -sI "$B/auth?provider=github&scope=repo" | grep -iE "^location|set-cookie"

# Le state du cookie doit correspondre a celui de l'URL
# Un /callback sans state valide doit refuser
curl -s "$B/callback?code=faux" | grep -o "authorization:github:error"

# Elevation de portee refusee (doit retomber sur repo)
curl -sI "$B/auth?scope=admin:org" | grep -o 'scope=[a-z:_]*'
```

Test fonctionnel : sur `/admin/`, créer une fiche brouillon, enregistrer, puis
vérifier qu'un commit apparaît sur GitHub et qu'un déploiement se déclenche.
Supprimer ensuite la fiche de test.
