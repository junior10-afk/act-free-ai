---
title_fr: "llama.cpp gagne en vitesse sur les machines sans GPU"
title_en: "llama.cpp gets faster on machines without a GPU"
date: "2026-10-12"
type: release
summary_fr: "Les optimisations récentes profitent surtout à l'exécution CPU, avec un meilleur usage des instructions vectorielles. Le serveur compatible OpenAI reste inchangé."
summary_en: "Recent optimisations mostly benefit CPU execution, with better use of vector instructions. The OpenAI-compatible server is unchanged."
body_fr: |-
  llama.cpp publie une série d'optimisations qui profitent principalement à l'exécution sur CPU.

  Ce que ça change :

  - **Des modèles quantifiés plus utilisables** sur un portable récent, pour de la rédaction ou du résumé.
  - **Un meilleur usage des instructions vectorielles**, donc un gain variable selon le processeur.
  - **Un serveur compatible OpenAI** inchangé côté client.

  Le gain dépend fortement de la machine : mesure avec ton propre modèle avant de conclure. Et garde en tête que la qualité plafonne sur les petits modèles quantifiés, surtout pour le code.
body_en: |-
  llama.cpp ships a series of optimisations that mainly benefit CPU execution.

  What it changes:

  - **Quantised models become more usable** on a recent laptop, for writing or summarising.
  - **Better use of vector instructions**, so gains vary with the processor.
  - **An unchanged OpenAI-compatible server** on the client side.

  The gain depends heavily on the machine: measure with your own model before concluding. And remember that quality plateaus on small quantised models, especially for code.
providers:
  - "llama-cpp"
draft: false
---
