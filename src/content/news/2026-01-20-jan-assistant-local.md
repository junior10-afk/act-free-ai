---
title_fr: "Jan publie une version bureau avec serveur local"
title_en: "Jan ships a desktop release with a local server"
date: "2026-01-20"
type: release
summary_fr: "L'application de bureau expose désormais une API compatible OpenAI sur localhost, ce qui permet de brancher n'importe quel client sans clé ni compte."
summary_en: "The desktop app now exposes an OpenAI-compatible API on localhost, so any client can plug in without a key or an account."
body_fr: |-
  Jan ajoute un serveur local à son application de bureau : une fois un modèle téléchargé, l'API répond sur `localhost` avec le format OpenAI.

  Trois usages immédiats :

  - **Développer hors ligne** sans consommer de crédits, puis changer l'URL au moment de passer en production.
  - **Garder les données sur la machine**, ce qui règle la question pour des notes internes ou des documents clients.
  - **Tester un agent** comme OpenCode ou AnythingLLM sans dépendre d'un fournisseur externe.

  La contrepartie est matérielle : la qualité plafonne vite sur un portable sans GPU, et les modèles les plus gros demandent de la mémoire. Pour du code, vise un modèle spécialisé plutôt qu'un généraliste compressé.
body_en: |-
  Jan adds a local server to its desktop app: once a model is downloaded, the API answers on `localhost` using the OpenAI format.

  Three immediate uses:

  - **Developing offline** without burning credits, then swapping the URL when you go to production.
  - **Keeping data on the machine**, which settles the question for internal notes or client documents.
  - **Trying an agent** such as OpenCode or AnythingLLM without depending on an external provider.

  The trade-off is hardware: quality plateaus quickly on a laptop without a GPU, and the largest models need memory. For code, aim at a specialised model rather than a compressed generalist.
providers:
  - "jan"
draft: false
---
