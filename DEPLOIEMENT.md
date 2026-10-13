# Déploiement d'Act-Free AI

Guide pas à pas, de la machine locale jusqu'au site en ligne.

Le code est prêt : build vert (87 pages), 2 commits, arbre de travail propre,
aucun secret versionné, `package-lock.json` suivi.

---

## 0. État actuel

| Étape | État |
| --- | --- |
| 1. Créer le dépôt GitHub | ✅ `junior10-afk/act-free-ai` (public) |
| 2. Créer un jeton d'accès | ✅ fait, puis utilisé ponctuellement |
| 3. Pousser le code | ✅ 6 commits sur `main`, upstream configuré |
| 4. Déployer sur Netlify | ⏳ à faire |
| 5. Brancher l'administration | ⏳ après le déploiement |
| 6. Répercuter l'URL réelle | ⏳ l'URL `act-free-ai.netlify.app` est déjà en place |

**Ce qui a débloqué le push.** Le diagnostic initial était trop pessimiste :
`api.github.com` **est** joignable, l'échec précédent était transitoire (et le
sandbox de l'assistant bloque GitHub, ce qui faussait le test). L'API GitHub
est donc utilisable — mais `gh` reste inutile ici, l'installation n'a jamais
abouti. La voie retenue est `git` + jeton fine-grained.

**Hygiène du jeton.** Il a été utilisé une seule fois, en argument ponctuel de
`git push`, avec `-c credential.helper=` pour court-circuiter le gestionnaire
d'identifiants. Vérifié après coup : `.git/config` contient l'URL **sans**
jeton, et aucune occurrence du jeton n'existe dans l'arborescence.
👉 **Il reste à le révoquer** : https://github.com/settings/personal-access-tokens

Les sections 1 à 3 ci-dessous sont conservées comme référence de ce qui a été
fait. **Tu peux passer directement à l'étape 4.**


---

## 1. Créer le dépôt GitHub

À faire dans ton navigateur : **https://github.com/new**

- **Repository name** : `act-free-ai`
- **Visibility** : `Public`
- ⚠️ **Ne coche RIEN** : ni README, ni .gitignore, ni licence.
  Un dépôt non vide ferait échouer le premier `push` (historiques divergents).

Tu obtiens une page vide avec des instructions. Ignore-les, on a déjà tout.

---

## 2. Créer un jeton d'accès (PAT)

Deux options. **La première est recommandée.**

### Option A — Jeton *fine-grained* (recommandé)

Limité à un seul dépôt, révocable, sans accès au reste de ton compte.

1. https://github.com/settings/personal-access-tokens/new
2. **Token name** : `act-free-ai-deploy`
3. **Expiration** : 7 jours (le temps du déploiement, tu pourras le refaire)
4. **Repository access** → `Only select repositories` → `act-free-ai`
5. **Permissions** → `Repository permissions` → **Contents** = `Read and write`
   *(c'est la seule permission nécessaire)*
6. **Generate token** → copie la valeur `github_pat_...`

### Option B — Jeton *classic*

https://github.com/settings/tokens/new → coche uniquement la case `repo`.

> **Hygiène du jeton — à lire une fois**
> - Ne colle **jamais** le jeton dans un fichier du projet (il finirait commité).
> - Ne le mets **pas** dans l'URL du remote de façon permanente : il serait
>   écrit en clair dans `.git/config`.
> - Révoke-le dès le déploiement terminé : https://github.com/settings/tokens
> - Le jeton est un mot de passe. Il ne doit apparaître ni dans un écran
>   partagé, ni dans un message.

---

## 3. Pousser le code

### Si tu me donnes le jeton

Je pousse en une commande, sans jamais l'écrire sur le disque :

```bash
cd "C:/Users/lemou/Desktop/Code - Tools/Sire web/Act-free-AI"
git remote add origin https://github.com/<TON_COMPTE>/act-free-ai.git
GIT_ASKPASS=/dev/null \
  git -c credential.helper= \
      push https://x-access-token:<LE_JETON>@github.com/<TON_COMPTE>/act-free-ai.git main
git remote set-url origin https://github.com/<TON_COMPTE>/act-free-ai.git
```

La dernière ligne **retire le jeton** de `.git/config`.

### Si tu préfères le faire toi-même

Dans **ton** terminal (Git Bash ou PowerShell) :

```bash
cd "C:/Users/lemou/Desktop/Code - Tools/Sire web/Act-free-AI"
git remote add origin https://github.com/<TON_COMPTE>/act-free-ai.git
git push -u origin main
```

Git Credential Manager ouvrira une fenêtre de navigateur pour te connecter.
C'est la voie la plus sûre : le jeton ne transite nulle part.

**Attendu** : `* [new branch] main -> main`, 74 fichiers, 2 commits.

---

## 4. Déployer sur Netlify

⚠️ **Passe par l'intégration GitHub, pas par un glisser-déposer de `dist/`.**
C'est important : le CMS (étape 5) écrit dans le dépôt Git, et chaque
enregistrement déclenche un rebuild. Un déploiement manuel casserait cette
boucle — tu publierais un article qui n'apparaîtrait jamais en ligne.

1. https://app.netlify.com → **Add new site** → **Import an existing project**
2. **Deploy with GitHub** → autorise Netlify (une seule fois)
3. Choisis le dépôt `act-free-ai`
4. Netlify lit `netlify.toml`, tu n'as rien à saisir. Vérifie juste :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : `22` (déjà dans `netlify.toml`)
5. **Deploy site**

Le premier build prend ~1–2 min. Netlify t'attribue une URL du type
`https://chose-aleatoire-123.netlify.app`.

**Sur le sous-domaine** : `act-free-ai` est très probablement déjà pris.
Dans **Site configuration → Change site name**, choisis un variant disponible
(`act-free-ai-fr`, `actfree-ai`, `act-free-ia`…). Dis-moi lequel tu obtiens,
je répercute l'URL partout (étape 6).

---

## 5. Brancher l'interface d'administration

Le proxy OAuth est **déjà écrit et testé** : `netlify/functions/auth.mjs` et
`netlify/functions/callback.mjs`, avec 14 tests qui passent (`npm run test:oauth`).
Il tourne sur ta propre origine — aucun service tiers ne voit le jeton GitHub.

### Option A — Proxy auto-hébergé (celle que tu as choisie)

**1. Créer l'OAuth App GitHub** — https://github.com/settings/developers

- **New OAuth App**
- **Application name** : `Act-Free AI CMS`
- **Homepage URL** : `https://<ton-site>.netlify.app`
- **Authorization callback URL** : `https://<ton-site>.netlify.app/callback`

> ⚠️ L'URL de callback doit correspondre **au caractère près**, sinon GitHub
> renvoie `redirect_uri_mismatch`. Pas de slash final.

Clique **Register application**, puis **Generate a new client secret**.
Note le **Client ID** et le **Client secret** (le secret n'est affiché qu'une fois).

**2. Déclarer les variables d'environnement** dans Netlify :

*Site configuration → Environment variables → Add a variable*

| Nom | Valeur |
| --- | --- |
| `GITHUB_OAUTH_CLIENT_ID` | ton Client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | ton Client secret |
| `SITE_URL` | `https://<ton-site>.netlify.app` |

> 🔴 **Le secret ne doit jamais entrer dans le dépôt.** Il vit uniquement dans
> les variables Netlify, qui sont chiffrées et invisibles depuis le navigateur.
> `SITE_URL` fixe le `redirect_uri` : sans elle, les déploiements de
> prévisualisation généreraient une URL de callback différente et GitHub
> refuserait l'échange.

**3. Redéployer** : *Deploys → Trigger deploy → Clear cache and deploy site*
(Les variables d'environnement ne sont prises en compte qu'au build suivant.)

**4. Vérifier le dépôt** dans `public/admin/config.yml` (déjà en place) :

```yaml
backend:
  name: github
  repo: junior10-afk/act-free-ai
  branch: main
  base_url: https://<ton-site>.netlify.app   # ← à ajuster si le sous-domaine change
  auth_endpoint: auth
```

**5. Se connecter** : `https://<ton-site>.netlify.app/admin/`

> Seuls les comptes GitHub ayant un **droit d'écriture** sur le dépôt peuvent
> publier. Un visiteur qui se connecte obtient un jeton sans droit sur le
> dépôt : GitHub refuse l'écriture. C'est la protection de fond du dispositif.

### Option B — Decap Turbo (aucun code à maintenir)

Le service officiel hébergé de Decap. L'offre **gratuite** couvre 1 site et
1 siège — exactement ce cas d'usage. En échange, c'est Decap qui voit le jeton.

1. Créer un compte sur https://turbo.decapcms.org/signup
2. Dans `public/admin/config.yml` :

   ```yaml
   backend:
     name: github
     repo: TON_COMPTE/act-free-ai
     branch: main
     base_url: https://api.turbo.decapcms.org
   ```
3. Supprimer `netlify/functions/` (devenu inutile)

### Option C — Netlify Identity + Git Gateway (repli)

Utile seulement si tu veux éviter complètement GitHub OAuth.

1. **Site configuration → Identity** → *Enable Identity*
2. **Identity → Registration** → mets **`Invite only`**
   🔴 **Ne saute pas cette étape.** Par défaut Identity accepte les
   inscriptions ouvertes : n'importe qui pourrait créer un compte, et avec
   Git Gateway ce compte peut écrire dans ton dépôt.
3. **Identity → Services → Git Gateway** → *Enable Git Gateway*
4. **Identity → Invite users** → invite ta propre adresse
5. Dans `config.yml`, remplacer le backend par :

   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```


---

## 6. Répercuter l'URL réelle

Une fois le sous-domaine connu, il reste **3 fichiers** où figure l'URL
provisoire `act-free-ai.netlify.app`. Dis-moi l'URL finale et je m'en occupe,
ou fais-le à la main :

| Fichier | Ligne | À remplacer |
| --- | --- | --- |
| `astro.config.mjs` | `site:` | URL canonique, sitemap, RSS |
| `public/robots.txt` | `Sitemap:` | plan du site |
| `public/admin/config.yml` | `site_url`, `display_url`, `logo_url` | liens du CMS |
| `public/admin/config.yml` | `repo:` | déjà réglé : `junior10-afk/act-free-ai` |

> Ces URL alimentent les balises `<link rel="canonical">` et `<hreflang>`.
> Si elles restent fausses, Google indexe une adresse qui n'existe pas.

Puis : `git add -A && git commit -m "URL de production" && git push`
→ Netlify redéploie automatiquement.

---

## 7. Contrôles après mise en ligne

À vérifier une fois le site en ligne :

```bash
# 1. Les en-têtes de sécurité sont bien servis
curl -sI https://<ton-site>.netlify.app/ | grep -iE "strict-transport|content-type-options|referrer|x-frame"

# 2. L'admin est bien exclu de l'indexation
curl -sI https://<ton-site>.netlify.app/admin/ | grep -i "x-robots-tag"

# 3. Le CMS est bien servi en local (pas de CDN tiers)
curl -s https://<ton-site>.netlify.app/admin/index.html | grep -o 'src="[^"]*"'
#    attendu : src="/admin/cms/decap-cms.js"  (aucune URL http:// externe)

# 4. La CSP est présente et script-src n'a pas d'unsafe-inline
curl -sI https://<ton-site>.netlify.app/fr/ | grep -i "content-security-policy"

# 5. Le proxy OAuth redirige bien vers GitHub avec un state
curl -sI "https://<ton-site>.netlify.app/auth?provider=github&scope=repo" | grep -iE "^location|set-cookie"
#    attendu : Location -> github.com/login/oauth/authorize?...state=...
#               Set-Cookie -> decap_oauth_state=...; HttpOnly; Secure; SameSite=Lax

# 6. /callback refuse un appel sans state valide (doit renvoyer une erreur)
curl -s "https://<ton-site>.netlify.app/callback?code=faux" | grep -o "authorization:github:error"
#    attendu : authorization:github:error

# 7. Les fonctions sont bien déployées
curl -sI https://<ton-site>.netlify.app/auth | head -1
#    attendu : HTTP/2 302   (un 404 signifierait que netlify/functions n'est pas déployé)
```

Côté navigateur, ouvre la console (F12) : **zéro erreur CSP** attendue.

Test fonctionnel : dans `/admin/`, crée un fournisseur brouillon, enregistre,
puis vérifie qu'un nouveau commit apparaît sur GitHub et qu'un déploiement
Netlify se déclenche. Supprime-le ensuite.

---

## 8. Ce qui a déjà été sécurisé

Rappel de l'audit — rien à refaire, c'est déjà dans le code :

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
| Fuite du client secret | uniquement en variable d'environnement Netlify, jamais dans le dépôt |

Ces éléments sont couverts par `npm run test:oauth` (14 tests).

**Il reste trois points qui dépendent de toi** :
1. définir `GITHUB_OAUTH_CLIENT_SECRET` dans Netlify, jamais dans le dépôt ;
2. révoquer le jeton PAT une fois le push effectué ;
3. si tu choisis l'option C, passer l'inscription Identity en *Invite only*.
