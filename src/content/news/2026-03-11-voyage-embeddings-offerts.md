---
title_fr: "Voyage AI offre des tokens pour évaluer ses embeddings"
title_en: "Voyage AI grants tokens to evaluate its embeddings"
date: "2026-03-11"
type: new
summary_fr: "Des tokens sont offerts à l'inscription pour tester les modèles par domaine (code, finance, droit) sur ton propre corpus."
summary_en: "Signup tokens let you test the domain models (code, finance, legal) on your own corpus."
body_fr: |-
  Voyage AI ajoute des tokens d'embedding offerts à l'inscription. L'idée est de permettre une évaluation sur un corpus réel avant de payer.

  Pourquoi ça compte pour un RAG :

  - **Les modèles par domaine** ne se valent pas selon les textes : un modèle juridique peut être médiocre sur du code.
  - **Le reranker change davantage le résultat** que le choix de l'embedding dans beaucoup de cas.
  - **Comparer sur tes données** vaut mieux que suivre un classement générique.

  Méthode simple : constitue cinquante questions avec leurs passages attendus, mesure le rappel à k, puis choisis. Le coût de l'évaluation est dérisoire face à celui d'une migration plus tard.
body_en: |-
  Voyage AI adds free embedding tokens at signup. The point is to allow evaluation on a real corpus before paying.

  Why it matters for RAG:

  - **Domain models are not equivalent** across text types: a legal model can be mediocre on code.
  - **The reranker often changes results more** than the embedding choice itself.
  - **Comparing on your own data** beats following a generic leaderboard.

  A simple method: build fifty questions with their expected passages, measure recall at k, then decide. The cost of evaluation is trivial next to the cost of a migration later.
providers:
  - "voyage-ai"
draft: false
---
