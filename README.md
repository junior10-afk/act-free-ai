# Act-Free AI

Annuaire bilingue (FR/EN) des fournisseurs qui donnent accès à des modèles d'IA **gratuitement**, et des **agents open source** qui les exploitent.

Site vitrine statique + interface d'administration privée.

---

## Stack

| Brique | Choix | Coût |
| --- | --- | --- |
| Générateur | Astro 7 (sortie statique) | 0 € |
| Hébergement | Netlify | 0 € |
| Domaine | sous-domaine `*.netlify.app` | 0 € |
| Admin | Decap CMS (`/admin`) | 0 € |
| Contenu | fichiers Markdown versionnés dans Git | 0 € |

Aucun serveur, aucune base de données. Le site est un ensemble de fichiers HTML générés au build.

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # génère dist/
npm run preview    # prévisualise le build
```

---

## Structure

```
src/
  content.config.ts        Schéma des collections (Zod)
  content/
    providers/             Un fichier .md par fournisseur
    agents/                Un fichier .md par agent
    news/                  Un fichier .md par actualité
  i18n/
    ui.ts                  Toutes les chaînes FR + EN
    utils.ts               Helpers de langue, dates, libellés
  layouts/BaseLayout.astro Métadonnées, hreflang, header, footer
  components/              Cartes, filtres, navigation
  pages/[lang]/            Toutes les pages, générées pour fr et en
  utils/markdown.ts        Rendu markdown minimal pour les corps d'articles
public/
  admin/                   Interface Decap CMS
  favicon.svg
netlify.toml               Build, en-têtes, redirection racine
```

### Routes générées

`/fr/` · `/fr/providers/` · `/fr/providers/<slug>/` · `/fr/agents/` · `/fr/agents/<slug>/` · `/fr/news/` · `/fr/news/<slug>/` · `/fr/compare/` · `/fr/rss.xml`

Les mêmes routes existent sous `/en/`. La racine `/` redirige vers la langue du navigateur, avec `/fr/` par défaut.

---

## Modèle de contenu

Les textes sont bilingues dans un **seul fichier** par entrée, via des champs suffixés `_fr` et `_en`. C'est plus simple à maintenir qu'un fichier par langue, et Decap CMS gère ça nativement.

### Fournisseur (`src/content/providers/`)

`name` · `url` · `description_fr/en` · `accessType` · `models` · `openaiCompatible` · `signupRequired` · `cardRequired` · `phoneRequired` · `quotas_fr/en` · `tags` · `featured` · `order` · `verifiedAt`

`accessType` : `unlimited` (gratuit durable) · `credits` (crédits offerts) · `freemium` (palier limité) · `local` (100 % local)

### Agent (`src/content/agents/`)

`name` · `repo` · `site` · `author` · `description_fr/en` · `license` · `category` · `worksWith` · `order` · `verifiedAt`

`category` : `coding` · `chat` · `automation` · `framework` · `local`
`worksWith` : liste d'identifiants de fournisseurs (le nom du fichier sans extension).

### Actualité (`src/content/news/`)

`title_fr/en` · `date` · `type` · `summary_fr/en` · `body_fr/en` · `providers` · `draft`

`type` : `new` · `change` · `shutdown` · `release`

---

## Interface d'administration

L'admin est servie sur `/admin` (Decap CMS). Deux modes.

### 1. Édition locale — immédiate, aucun réglage

```bash
npm run dev      # terminal 1
npm run cms      # terminal 2
```

Ouvre <http://localhost:4321/admin/>. Les modifications sont écrites directement dans tes fichiers locaux, que tu commites ensuite. **Rien n'est exposé sur le web.**

### 2. Édition en ligne — deux chemins possibles

Pour éditer depuis n'importe quel navigateur, il faut une authentification. Decap CMS en propose deux, et le fichier `config.yml` contient les deux (l'une est active, l'autre commentée).

#### Option A — Git Gateway + Netlify Identity *(le plus simple)*

C'est le chemin historique de Decap CMS, et il redevient le plus court.

> **À jour de février 2026 :** Netlify avait annoncé la fin de Netlify Identity, puis a **fait marche arrière le 19 février 2026**. Identity reste un service supporté, gratuit sur les offres au crédit. Les guides qui affirment le contraire datent d'avant cette date.

Mise en place : dans Netlify, Project configuration → Identity → *Enable Identity*, puis Services → Git Gateway → *Enable*. Tu invites ensuite ta propre adresse dans l'onglet Identity, et c'est terminé. Aucun déploiement supplémentaire, aucun secret à gérer.

Configuration correspondante :

```yaml
backend:
  name: git-gateway
  branch: main
```

#### Option B — Backend GitHub + proxy OAuth

Plus verbeux, mais sans dépendance à Netlify Identity.

**a.** Pousser le projet sur GitHub, puis renseigner le dépôt dans `public/admin/config.yml` :

```yaml
backend:
  name: github
  repo: TON_COMPTE/act-free-ai
  branch: main
```

**b.** Créer une GitHub OAuth App — Settings → Developer settings → OAuth Apps → New OAuth App.

- Homepage URL : `https://act-free-ai.netlify.app`
- Authorization callback URL : l'URL de ton proxy (étape c)

**c.** Déployer un proxy OAuth. Decap ne peut pas échanger le code OAuth lui-même. Le plus simple est de déployer un proxy prêt à l'emploi (par exemple `vencax/netlify-cms-github-oauth-provider`) sur Netlify, d'y renseigner le `client_id` et le `client_secret` de l'OAuth App, puis de déclarer son URL dans `config.yml` :

```yaml
backend:
  name: github
  repo: TON_COMPTE/act-free-ai
  branch: main
  base_url: https://ton-proxy-oauth.netlify.app
```

Dans les deux cas, chaque publication crée un commit dans le dépôt, ce qui déclenche un redéploiement Netlify. Le site est à jour en une minute environ.

L'admin est exclue de l'indexation (`robots.txt` + en-tête `X-Robots-Tag`).

---

## Sécurité

Le site est statique, sans serveur ni base de données, et n'accepte aucune saisie utilisateur. La surface d'attaque est donc très réduite. Ce qui a été mis en place :

### Aucune dépendance tierce à l'exécution

Le site ne charge **rien** depuis un domaine externe : polices, scripts et styles viennent tous de `act-free-ai.netlify.app`. Vérifiable dans le build : `grep -rl "fonts.googleapis\|unpkg.com" dist/` ne renvoie rien.

- Les polices sont téléchargées et servies par Astro (`fonts` dans `astro.config.mjs`).
- Decap CMS est recopié depuis `node_modules` par `scripts/sync-cms.mjs` à chaque build, au lieu d'être chargé depuis un CDN. Un script d'administration chargé depuis un tiers est une dépendance de chaîne d'approvisionnement : s'il est compromis, du code arbitraire s'exécute sur la page qui a le droit d'écrire dans le dépôt.

### Content-Security-Policy

Astro calcule les hachages de ses scripts et styles inline et injecte la politique dans chaque page :

```
font-src 'self'
script-src 'self' 'sha256-…' ×8
style-src 'self'
style-src-elem 'self' 'sha256-…' ×3
style-src-attr 'unsafe-inline'
```

`script-src` n'autorise que ce site et les scripts dont le hachage est connu : aucun script tiers ou injecté ne peut s'exécuter. La seule exception est `style-src-attr 'unsafe-inline'`, nécessaire parce que les composants utilisent des attributs `style="…"`. Un attribut de style ne peut pas exécuter de code, le risque résiduel se limite à du maquillage d'interface — déjà couvert par `X-Frame-Options`.

### En-têtes HTTP

Définis dans `netlify.toml` : `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (caméra, micro, géolocalisation, paiement désactivés), `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.

### Rendu du contenu

Le contenu est écrit par le propriétaire du site, mais il est traité comme non fiable par principe :

- `src/utils/markdown.ts` échappe le HTML **avant** toute transformation, et les liens n'acceptent que des URL `http(s)://`. Écrire `<script>` dans un article produit du texte, pas du code.
- `src/utils/json.ts` échappe `<`, `>`, `&` et les séparateurs Unicode avant d'injecter du JSON dans une balise `<script>` (page comparateur), ce qui empêche toute sortie de la balise.

### Interface d'administration

- Exclue de l'indexation : `robots.txt` + en-tête `X-Robots-Tag: noindex, nofollow, noarchive`.
- Jamais mise en cache (`Cache-Control: no-store`), non encadrable (`X-Frame-Options: DENY`).
- **Aucun secret dans le dépôt.** Le `client_secret` de l'application OAuth GitHub ne vit que dans les variables d'environnement du proxy, jamais dans `config.yml` ni ailleurs dans le code.
- L'authentification repose sur GitHub : seuls les comptes ayant un droit d'écriture sur le dépôt peuvent publier. Un visiteur qui découvre `/admin` ne peut rien faire.
- Volontairement privée de CSP : Decap injecte ses styles à l'exécution et ouvre une fenêtre vers GitHub, ce qu'une politique stricte casserait.

### Vérifications à refaire après une modification

```bash
grep -rInE "client_secret|api[_-]?key|ghp_|sk-[A-Za-z0-9]{20,}" src public *.json *.mjs *.toml
grep -rl "unpkg.com\|cdn.jsdelivr\|cdnjs\|fonts.googleapis" dist/
git status --short   # rien de sensible ne doit apparaître
```

---

## Déploiement sur Netlify

### Première mise en ligne

```bash
npm run build     # vérifie que tout compile
```

Puis, au choix :

- **Via l'interface Netlify** : « Add new site » → « Import an existing project » → connecte GitHub → choisis le dépôt. Netlify lit `netlify.toml` tout seul (commande `npm run build`, dossier `dist`).
- **Via la CLI** : `npx netlify-cli deploy --prod`

Le site est en ligne sur `https://<nom-du-site>.netlify.app`. Tu peux renommer le sous-domaine dans Site configuration → Domain management. Le nom `act-free-ai` est probablement déjà pris : prends une variante.

### Ajouter un vrai domaine plus tard

Aucun code à changer. Domain management → Add a domain, puis chez ton registrar :

- soit tu pointes les serveurs DNS vers Netlify,
- soit tu crées un enregistrement `CNAME` vers `<nom>.netlify.app`.

Netlify émet le certificat HTTPS automatiquement. Il faut aussi mettre à jour `site` dans `astro.config.mjs` et l'URL dans `public/robots.txt`.

---

## Notes

- Le thème visuel est éditorial clair : fond crème, titres en serif (Fraunces), texte en Inter, un seul accent terracotta.
- Les filtres et le comparateur tournent entièrement dans le navigateur : aucune donnée n'est envoyée nulle part.
- Les quotas des fournisseurs changent souvent. Chaque fiche affiche sa date de vérification ; c'est le champ à tenir à jour en priorité.
