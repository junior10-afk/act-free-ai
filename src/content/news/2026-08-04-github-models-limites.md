---
title_fr: "GitHub Models resserre ses limites de requêtes"
title_en: "GitHub Models tightens its request limits"
date: "2026-08-04"
type: change
summary_fr: "Le quota gratuit diminue sur les modèles les plus demandés. L'accès reste pratique pour tester dans GitHub Actions."
summary_en: "The free quota shrinks on the most requested models. Access remains handy for testing inside GitHub Actions."
body_fr: |-
  GitHub Models réduit les limites de requêtes sur plusieurs modèles, en particulier les plus demandés.

  Ce qui reste valable :

  - **Le test dans un workflow** GitHub Actions, avec un jeton déjà présent.
  - **La comparaison de modèles** sans gérer plusieurs comptes.
  - **Un terrain d'essai pour un prototype**, pas pour un service.

  Si ton projet dépend de ce quota, mesure la consommation par exécution de workflow et mets en cache les réponses stables. Et garde une clé chez un fournisseur compatible OpenAI pour les moments où le quota bloque.
body_en: |-
  GitHub Models lowers request limits on several models, especially the most requested ones.

  What still holds:

  - **Testing inside a GitHub Actions workflow**, with a token already available.
  - **Comparing models** without juggling several accounts.
  - **A playground for a prototype**, not for a service.

  If your project depends on this quota, measure consumption per workflow run and cache stable responses. And keep a key with an OpenAI-compatible provider for the moments when the quota blocks you.
providers:
  - "github-models"
draft: false
---
