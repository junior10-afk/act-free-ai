# AGENTS.md — Act-Free AI

Instructions pour tout agent (OpenCode ou autre) travaillant dans ce dépôt.
Objectif : publier ou modifier du contenu sans casser le déploiement.

## Chain de publication (à connaître)

```
src/content/*.md → commit + push sur main → Netlify build → en ligne en ~1 min
```

- Le contenu vit dans `src/content/` : `providers/`, `agents/`, `news/`
- Découverte : le site réel <https://act-free-ai.netlify.app>. Le détail du
  workflow est dans `DEPLOIEMENT.md`.

## Routine de publication (obligatoire, dans cet ordre)

1. **Synchroniser** : `git pull --ff-only` (le CMS web Decap crée des commits
   directement sur GitHub ; la copie locale est souvent en retard).
2. **Vérifier le schéma** du contenu ci-dessous ; chaque champ est validé par
   Zod (`src/content.config.ts`) et une entrée invalide **fait échouer le
   build Netlify**.
3. **Créer/modifier** le fichier markdown concerné. Tout le contenu doit être
   bilingue (champs `_fr` et `_en`).
4. **Vérifier le build localement** si possible : `npm run build` (le prebuild
   exécute `sync-cms.mjs`, c'est normal).
5. **Committer** avec un message court en français, style du dépôt :
   `Ajoute un fournisseur : X` / `Met a jour la fiche Y` / `Ajoute une actualite : Z`
6. **Pusher** : `git push origin main` (déclenche le déploiement automatique).
7. **Vérifier en ligne** une minute plus tard (curl ou navigateur sur
   l'URL publique de la fiche modifiée).

## Schémas des collections

### providers/ — une fiche par fournisseur, slug = id

```yaml
name: NomAffiché
url: https://...            # URL valide obligatoire
description_fr / description_en
accessType: unlimited|credits|freemium|local
models: [text|image|video|audio|code|embedding|rerank]  # sous-ensemble
openaiCompatible / signupRequired / cardRequired / phoneRequired: bool
quotas_fr / quotas_en: optionnel
tags: [ ... ]               # libres, en français
featured: bool  /  order: nombre
verifiedAt: AAAA-MM-JJ      # date de la dernière vérification humaine
```

Fichier de référence pour les champs exacts : voir une fiche existante
(p. ex. `src/content/providers/groq.md`) et copier sa structure.

### agents/ — slug = id

```yaml
name, repo (URL GitHub), site (URL, optionnel), author,
description_fr / description_en, license,
category: coding|chat|automation|framework|local,
worksWith: [...], order: nombre, verifiedAt (date)
```

### news/ — nom de fichier `AAAA-MM-sujet.md`

```yaml
title_fr / title_en, date: "AAAA-MM-JJ" (en chaîne, citée),
type: new|change|shutdown|release,
summary_fr / summary_en, body_fr / body_en (markdown, optionnel),
providers: [slugs des fournisseurs liés], draft: bool
```

## Règles absolues

- **Ne jamais pusher sans `git pull --ff-only` avant.**
- **Ne jamais éditer `dist/`** (généré) ni `netlify/functions/` sans besoins
  spécifiques (code sensible, tests OAuth dans `npm run test:oauth`).
- **Ne jamais toucher** aux variables/secrets Netlify ou GitHub ; le push
  suffit, le déploiement est automatique.
- Dernier recours uniquement (dépannage, à la demande explicite de
  l'utilisateur) : `scripts/deploy-netlify.mjs` avec `NETLIFY_AUTH_TOKEN` —
  un déploiement par API n'applique pas `netlify.toml` (voir
  `DEPLOIEMENT.md` § 6).
- Historisation : chaque publication = un commit propre. Ne pas reécrire
  l'historique poussé.
