---
title_fr: "OpenRouter retire plusieurs modèles de son catalogue gratuit"
title_en: "OpenRouter pulls several models from its free catalogue"
date: "2026-03-06"
type: change
summary_fr: "Plusieurs variantes « :free » disparaissent du catalogue. Le rappel habituel : ne construis pas une dépendance critique sur un modèle gratuit."
summary_en: "Several \":free\" variants disappear from the catalogue. The usual reminder: do not build a critical dependency on a free model."
body_fr: |-
  OpenRouter a retiré plusieurs modèles de son catalogue gratuit. Le mécanisme est connu : une variante suffixée `:free` reste disponible tant que l'éditeur l'accepte, puis disparaît.

  Ce qu'il faut en tirer :

  - **Un modèle gratuit est un prêt, pas un contrat.** Prévois une variable de configuration pour changer de modèle sans redéployer.
  - **Surveille les erreurs 404 de modèle** dans tes logs : c'est souvent le premier signe d'un retrait.
  - **Garde une alternative payante** à quelques centimes pour les fonctionnalités critiques.

  L'intérêt d'OpenRouter reste la flexibilité : changer de fournisseur se fait en une ligne, à condition que ton code ne soit pas câblé sur un identifiant précis.
body_en: |-
  OpenRouter has removed several models from its free catalogue. The mechanism is familiar: a variant suffixed `:free` remains available as long as the vendor allows it, then disappears.

  What to take away:

  - **A free model is a loan, not a contract.** Keep a configuration variable so you can switch models without redeploying.
  - **Watch for model 404s** in your logs: they are usually the first sign of a withdrawal.
  - **Keep a cheap paid fallback** for critical features.

  OpenRouter's value remains flexibility: switching providers takes one line, provided your code is not hard-wired to a specific identifier.
providers:
  - "openrouter"
draft: false
---
