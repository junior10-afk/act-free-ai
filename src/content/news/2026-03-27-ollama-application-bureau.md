---
title_fr: "Ollama soigne son application de bureau"
title_en: "Ollama polishes its desktop app"
date: "2026-03-27"
type: release
summary_fr: "L'application gagne une gestion des modèles plus claire et un meilleur suivi de la mémoire utilisée. Le serveur local reste le même."
summary_en: "The app gains clearer model management and better tracking of memory use. The local server is unchanged."
body_fr: |-
  Ollama met à jour son application de bureau : liste des modèles plus lisible, indication de la mémoire occupée et téléchargements reprenables.

  Ce qui change au quotidien :

  - **Savoir ce qui tient en mémoire** avant de lancer un modèle trop gros pour la machine.
  - **Reprendre un téléchargement interrompu**, ce qui compte sur une connexion lente.
  - **Garder la même API locale**, donc aucun changement pour les clients existants.

  Rappel utile : l'application reste un confort, le cœur du projet est le serveur. En production, c'est ce dernier que tu exposes, derrière un reverse proxy et une authentification.
body_en: |-
  Ollama updates its desktop app: a clearer model list, an indication of memory usage and resumable downloads.

  What changes day to day:

  - **Knowing what fits in memory** before launching a model too large for the machine.
  - **Resuming an interrupted download**, which matters on a slow connection.
  - **Keeping the same local API**, so existing clients need no change.

  A useful reminder: the app is convenience, the project's core is the server. In production, that is what you expose, behind a reverse proxy and authentication.
providers:
  - "ollama"
draft: false
---
