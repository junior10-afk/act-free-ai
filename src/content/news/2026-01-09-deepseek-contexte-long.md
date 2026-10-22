---
title_fr: "DeepSeek étend le contexte de son modèle de raisonnement"
title_en: "DeepSeek widens the context of its reasoning model"
date: "2026-01-09"
type: change
summary_fr: "Le modèle de raisonnement accepte désormais des entrées beaucoup plus longues, facturées au token. Bonne nouvelle pour l'analyse de dépôts entiers, moins pour le budget."
summary_en: "The reasoning model now accepts much longer inputs, billed per token. Good news for whole-repository analysis, less so for the budget."
body_fr: |-
  DeepSeek augmente la fenêtre de contexte de son modèle de raisonnement. L'intérêt est immédiat pour les tâches qui étaient jusqu'ici impossibles : relire un dépôt entier, comparer plusieurs contrats, ou garder tout un historique de conversation dans la même requête.

  Attention à trois choses :

  - **La facturation suit la longueur.** Un contexte doublé double la facture d'entrée, même si le modèle ne lit qu'une partie.
  - **La qualité ne suit pas linéairement.** Au-delà de quelques dizaines de milliers de tokens, la précision sur les détails du milieu de document baisse.
  - **Le cache de prompt** devient rentable : un même préambule réutilisé coûte moins cher qu'une réécriture complète.

  Pour l'analyse de code, la bonne pratique reste de découper par module et de résumer, plutôt que d'envoyer tout le dépôt d'un coup.
body_en: |-
  DeepSeek widens its reasoning model's context window. The benefit is immediate for tasks that were previously impossible: re-reading a whole repository, comparing several contracts, or keeping an entire conversation history inside one request.

  Three things to watch:

  - **Billing follows length.** A doubled context doubles the input bill, even if the model only reads part of it.
  - **Quality does not scale linearly.** Past a few tens of thousands of tokens, accuracy on details buried mid-document drops.
  - **Prompt caching** becomes worthwhile: a reused preamble costs far less than rewriting it every time.

  For code analysis, the sane approach is still to split by module and summarise, rather than sending the whole repository at once.
providers:
  - "deepseek"
draft: false
---
