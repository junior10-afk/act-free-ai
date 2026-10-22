---
title_fr: "OpenCode ajoute un mode plan avant exécution"
title_en: "OpenCode adds a plan mode before execution"
date: "2026-01-27"
type: release
summary_fr: "L'agent de terminal sépare désormais la réflexion de l'action : il propose un plan, tu le valides, puis il modifie les fichiers. Moins de surprises sur les gros refactors."
summary_en: "The terminal agent now separates thinking from acting: it proposes a plan, you approve it, then it edits files. Fewer surprises on large refactors."
body_fr: |-
  OpenCode introduit un mode où l'agent décrit d'abord son intention, puis attend une validation avant de toucher au dépôt. Le plan liste les fichiers concernés et l'ordre des modifications.

  Pourquoi c'est utile :

  - **Les refactors importants** deviennent relisibles avant d'être appliqués, ce qui évite les séries de corrections en cascade.
  - **Le coût baisse** : un plan court coûte moins cher qu'un long aller-retour d'outils sur un malentendu.
  - **La revue de code reste humaine** sur les décisions d'architecture, au lieu d'être un rattrapage.

  Le mode plan n'est pas gratuit en tokens : il ajoute un aller-retour. Sur une modification triviale, désactive-le. Sur tout ce qui touche plusieurs fichiers, garde-le.
body_en: |-
  OpenCode introduces a mode where the agent first describes its intent, then waits for approval before touching the repository. The plan lists the affected files and the order of edits.

  Why it helps:

  - **Large refactors** become reviewable before they are applied, avoiding cascades of corrective patches.
  - **Costs go down**: a short plan is cheaper than a long tool round-trip based on a misunderstanding.
  - **Code review stays human** for architecture decisions instead of turning into cleanup.

  Plan mode is not free in tokens: it adds a round-trip. Turn it off for a trivial edit; keep it for anything touching several files.
providers: []
draft: false
---
