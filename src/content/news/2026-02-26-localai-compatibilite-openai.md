---
title_fr: "LocalAI renforce sa compatibilité avec les clients OpenAI"
title_en: "LocalAI strengthens compatibility with OpenAI clients"
date: "2026-02-26"
type: release
summary_fr: "Le serveur auto-hébergé couvre davantage d'endpoints : texte, images, voix et embeddings sur une seule instance. Le passage d'un fournisseur payant devient trivial."
summary_en: "The self-hosted server covers more endpoints: text, images, speech and embeddings on a single instance. Switching from a paid provider becomes trivial."
body_fr: |-
  LocalAI aligne davantage d'endpoints sur le format OpenAI, ce qui réduit le travail d'adaptation quand on développe hors ligne.

  Ce que ça simplifie :

  - **Un seul point d'entrée** pour le texte, les images, la voix et les embeddings.
  - **Le même code client** en local et en production, seules l'URL et la clé changent.
  - **Les tests d'intégration** peuvent tourner sans réseau ni facture.

  En contrepartie, il faut assumer l'exploitation : téléchargement des modèles, mémoire, mises à jour. Pour un poste de développement, c'est un bon compromis ; pour un service public, préfère un moteur spécialisé comme vLLM.
body_en: |-
  LocalAI aligns more endpoints on the OpenAI format, cutting the adaptation work when developing offline.

  What it simplifies:

  - **A single entry point** for text, images, speech and embeddings.
  - **The same client code** locally and in production, only the URL and key change.
  - **Integration tests** can run without network access or a bill.

  In return, you own the operations: model downloads, memory, updates. For a development machine it is a good trade-off; for a public service, prefer a specialised engine such as vLLM.
providers:
  - "localai"
draft: false
---
