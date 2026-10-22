---
title_fr: "Cloudflare étend son quota gratuit pour les bases vectorielles"
title_en: "Cloudflare extends its free quota for vector databases"
date: "2026-03-17"
type: change
summary_fr: "Vectorize et Workers AI restent utilisables sans frais dans les limites du plan gratuit. Un bon moyen de monter un RAG à l'edge, à condition de rester petit."
summary_en: "Vectorize and Workers AI stay usable at no cost within the free plan limits. A good way to run edge RAG, as long as you stay small."
body_fr: |-
  Cloudflare ajuste les limites de son plan gratuit pour Vectorize et Workers AI. L'ensemble permet de faire tourner un petit RAG sans serveur à administrer.

  Ce que ça couvre :

  - **L'inférence** sur une sélection de modèles ouverts, via Workers AI.
  - **Le stockage vectoriel** et la recherche approximative, via Vectorize.
  - **Le calcul à l'edge**, avec une latence faible pour les utilisateurs proches d'un point de présence.

  Les limites restent dimensionnées pour un projet, pas pour un produit à trafic soutenu : nombre de vecteurs, requêtes par jour et taille des réponses. Mesure tôt, migre avant de saturer.
body_en: |-
  Cloudflare adjusts the free plan limits for Vectorize and Workers AI. Together they let a small RAG run without a server to administer.

  What it covers:

  - **Inference** on a selection of open models through Workers AI.
  - **Vector storage** and approximate search through Vectorize.
  - **Edge compute**, with low latency for users near a point of presence.

  The limits remain sized for a project, not a high-traffic product: number of vectors, daily requests and response sizes. Measure early, migrate before saturation.
providers:
  - "cloudflare-workers-ai"
draft: false
---
