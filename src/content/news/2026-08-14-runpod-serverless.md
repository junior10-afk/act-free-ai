---
title_fr: "RunPod simplifie ses endpoints serverless"
title_en: "RunPod simplifies its serverless endpoints"
date: "2026-08-14"
type: change
summary_fr: "Le déploiement d'un modèle derrière une API prend moins d'étapes, avec mise à l'échelle automatique. Les crédits d'accueil restent ponctuels."
summary_en: "Deploying a model behind an API takes fewer steps, with automatic scaling. Welcome credits remain one-off."
body_fr: |-
  RunPod simplifie la création d'endpoints serverless : le modèle se déploie derrière une URL, avec mise à l'échelle et facturation à la seconde.

  Trois conséquences :

  - **Le coût devient proportionnel à l'usage**, sans machine allumée en permanence.
  - **Le cold start** reste le compromis à surveiller pour une expérience interactive.
  - **Les crédits d'accueil** permettent de valider, mais ne financent pas un service.

  C'est une bonne option quand tu veux héberger un modèle ouvert sans gérer de Kubernetes. Prévois un banc d'essai avec ta charge réelle pour régler la concurrence des workers.
body_en: |-
  RunPod simplifies creating serverless endpoints: the model is deployed behind a URL, with autoscaling and per-second billing.

  Three consequences:

  - **Cost becomes proportional to usage**, with no machine running permanently.
  - **Cold start** remains the trade-off to watch for an interactive experience.
  - **Welcome credits** validate the idea but do not fund a service.

  It is a good option when you want to host an open model without managing Kubernetes. Plan a benchmark with your real workload to tune worker concurrency.
providers:
  - "runpod"
draft: false
---
