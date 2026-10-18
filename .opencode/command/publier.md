---
description: Publie ou met a jour du contenu sur le site (provider, agent ou actualite)
---

Publie sur le site Act-Free AI. Demande en cas d'ambiguite :

1. Le type d'entree : `provider`, `agent` ou `news`
2. La source : URL a verifier, ou contenu fourni par l'utilisateur

Puis suis AGENTS.md (routine de publication) :

- `git pull --ff-only` avant tout
- Cree ou modifie le fichier markdown dans `src/content/<collection>/` en
  respectant le schema Zod de `src/content.config.ts`
- Contenu bilingue obligatoire (champs `_fr` + `_en`)
- Si la source est une URL, verifie les faits dessus avant de rediger
  (palier gratuit, quotas, cartes bancaires, telephone) et renseigne
  `verifiedAt` a la date du jour
- `npm run build` pour valider, puis commit (message court en francais) et
  `git push origin main`
- Verifie la mise en ligne a la fin

Arguments de la commande (optionnels) : `$ARGUMENTS`
