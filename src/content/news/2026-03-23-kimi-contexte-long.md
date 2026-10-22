---
title_fr: "Kimi pousse encore la limite de contexte"
title_en: "Kimi pushes the context limit further"
date: "2026-03-23"
type: change
summary_fr: "Le modèle accepte des documents toujours plus longs, avec un cache de prompt pour amortir les préambules répétés. La facturation reste au token."
summary_en: "The model accepts ever longer documents, with prompt caching to amortise repeated preambles. Billing stays per token."
body_fr: |-
  Kimi augmente sa fenêtre de contexte et met en avant le cache de prompt, qui facture moins cher un préambule déjà envoyé.

  Deux usages qui en profitent :

  - **Analyser une documentation entière** en gardant les renvois entre sections.
  - **Faire tenir un long historique** dans une même conversation, sans résumé intermédiaire.

  Le piège classique : croire que tout le contexte est utilisé avec la même attention. Sur des documents de plusieurs centaines de pages, place les consignes importantes au début et à la fin, et fais vérifier les citations par un test automatique.
body_en: |-
  Kimi increases its context window and highlights prompt caching, which bills an already-sent preamble at a lower rate.

  Two uses that benefit:

  - **Analysing a full documentation set** while keeping cross-references between sections.
  - **Keeping a long history** inside one conversation, without intermediate summaries.

  The classic trap: assuming the entire context receives the same attention. On documents hundreds of pages long, put key instructions at the start and the end, and verify citations with an automated test.
providers:
  - "moonshot-kimi"
draft: false
---
