# Déploiement d'Act-Free AI

Guide pas à pas, de la machine locale jusqu'au site en ligne.

Le code est prêt : build vert (87 pages), 2 commits, arbre de travail propre,
aucun secret versionné, `package-lock.json` suivi.

---

## 0. Ce qui bloque aujourd'hui

La seule étape que je ne peux pas exécuter à ta place est **l'authentification
GitHub**. Voici pourquoi, pour que tu ne perdes pas de temps à chercher :

| Vérification | Résultat | Conséquence |
| --- | --- | --- |
| `github.com` joignable | ✅ `200` | `git push` fonctionne |
| `api.github.com` joignable | ❌ `000` | `gh` est **inutilisable** |
| Identifiants GitHub stockés | ❌ aucun | une authentification est requise |
| `gh` installé | ❌ | et l'installer ne servirait à rien (voir ci-dessus) |

`gh auth login` et `gh repo create` passent tous les deux par `api.github.com`,
qui est injoignable depuis cet environnement. **`gh` n'est donc pas la solution**
— inutile de l'installer.

La solution est `git` + un **jeton d'accès personnel (PAT)**.

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

### Option A — Netlify Identity + Git Gateway (le plus simple)

Aucun code à écrire, tout se fait dans l'interface Netlify.

1. **Site configuration → Identity** → *Enable Identity*
2. **Identity → Registration** → mets **`Invite only`**
   🔴 **Ne saute pas cette étape.** Par défaut Identity accepte les
   inscriptions ouvertes : n'importe qui pourrait créer un compte, et avec
   Git Gateway ce compte peut écrire dans ton dépôt. C'est la faille la plus
   fréquente sur cette pile.
3. **Identity → Services → Git Gateway** → *Enable Git Gateway*
4. **Identity → Invite users** → invite ta propre adresse e-mail
5. Clique le lien reçu, définis ton mot de passe
6. Dans `public/admin/config.yml`, remplace le bloc `backend` actif par :

   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

   (le bloc `git-gateway` est déjà présent en commentaire, lignes 32-34)
7. Commit + push → Netlify redéploie
8. Va sur `https://<ton-site>.netlify.app/admin/` et connecte-toi

### Option B — Proxy OAuth GitHub

Plus robuste, mais demande de déployer un service supplémentaire. À choisir
si tu veux éviter Netlify Identity. Compte ~30 min. Dis-moi si tu préfères
cette voie, je te détaille la procédure.

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
| `public/admin/config.yml` | `repo:` | `TON_COMPTE/act-free-ai` |

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

**Il reste deux points qui dépendent de toi**, tous les deux à l'étape 5 :
l'inscription Identity en mode *Invite only*, et la révocation du jeton PAT
après déploiement.
