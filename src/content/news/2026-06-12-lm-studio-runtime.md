---
title_fr: "LM Studio améliore son serveur local"
title_en: "LM Studio improves its local server"
date: "2026-06-12"
type: release
summary_fr: "Le serveur local gagne le chargement à la demande et un meilleur contrôle de la mémoire. Pratique pour garder plusieurs modèles installés sans tout charger."
summary_en: "The local server gains on-demand loading and better memory control. Handy for keeping several models installed without loading them all."
body_fr: |-
  LM Studio améliore son serveur local : chargement à la demande, déchargement automatique et meilleure estimation de la mémoire nécessaire.

  Ce que ça change :

  - **Plusieurs modèles installés**, un seul chargé à la fois selon la demande.
  - **Moins de plantages** quand la mémoire est proche de la limite.
  - **Une API compatible OpenAI**, donc les clients existants continuent de fonctionner.

  Le compromis reste le temps de chargement : le premier appel après déchargement est plus lent. Pour une démo, charge le modèle à l'avance ; pour un poste de développement, laisse faire la demande.
body_en: |-
  LM Studio improves its local server: on-demand loading, automatic unloading and better memory estimates.

  What changes:

  - **Several models installed**, only one loaded at a time depending on demand.
  - **Fewer crashes** when memory is close to the limit.
  - **An OpenAI-compatible API**, so existing clients keep working.

  The trade-off remains load time: the first call after unloading is slower. For a demo, preload the model; on a development machine, let demand drive it.
providers:
  - "lm-studio"
draft: false
---
