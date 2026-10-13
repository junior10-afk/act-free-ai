export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export const defaultLang = 'fr';

export type Lang = keyof typeof languages;

export const ui = {
  fr: {
    'site.name': 'Act-Free AI',
    'site.tagline': 'Modèles gratuits, agents ouverts',
    'site.description':
      "Annuaire des fournisseurs qui donnent accès à des modèles d'IA gratuitement, et des agents open source qui les exploitent. Chaque fiche est datée et vérifiée.",

    'nav.home': 'Accueil',
    'nav.providers': 'Fournisseurs',
    'nav.agents': 'Agents',
    'nav.news': 'Actualités',
    'nav.compare': 'Comparer',
    'nav.menu': 'Menu',

    'home.eyebrow': 'Annuaire vérifié',
    'home.title': "L'IA gratuite, recensée et vérifiée.",
    'home.lead':
      "Quels fournisseurs donnent vraiment accès à des modèles sans payer ? Quels agents open source les exploitent ? Tout est ici, avec la date de dernière vérification.",
    'home.ctaProviders': 'Voir les fournisseurs',
    'home.ctaNews': "Lire les actualités",
    'home.statProviders': 'Fournisseurs recensés',
    'home.statAgents': 'Agents open source',
    'home.statNews': 'Actualités publiées',
    'home.featured': 'À la une',
    'home.featuredLead': 'Les accès gratuits les plus généreux du moment.',
    'home.latest': 'Dernières actualités',
    'home.viewAll': 'Tout voir',
    'home.agentsTitle': 'Agents open source',
    'home.agentsLead':
      "Des agents que tu peux installer chez toi et brancher sur les fournisseurs gratuits ci-dessus.",
    'home.aboutTitle': 'Comment ça marche',
    'home.aboutBody':
      "Chaque fiche fournisseur indique le type d'accès gratuit, les modèles disponibles, ce qu'il faut fournir à l'inscription et les quotas connus. Chaque fiche agent indique le dépôt, la licence et les fournisseurs compatibles. Les informations changent vite : la date de vérification est toujours affichée, et rien ne remplace un coup d'œil aux conditions officielles.",

    'providers.title': 'Fournisseurs de modèles gratuits',
    'providers.lead':
      "Plateformes et API qui donnent accès à des modèles sans frais. Filtre selon ce que tu peux accepter : carte bancaire, téléphone, quotas.",
    'providers.search': 'Rechercher un fournisseur, un modèle, un tag…',
    'providers.filterAccess': "Type d'accès",
    'providers.filterModels': 'Type de modèle',
    'providers.filterRequirements': 'Conditions',
    'providers.filterAll': 'Tous',
    'providers.reset': 'Réinitialiser',
    'providers.results': 'résultat',
    'providers.resultsPlural': 'résultats',
    'providers.empty': 'Aucun fournisseur ne correspond à ces filtres.',
    'providers.count': 'fournisseurs',

    'access.unlimited': 'Gratuit durable',
    'access.unlimited.desc': 'Pas de limite de temps annoncée',
    'access.credits': 'Crédits offerts',
    'access.credits.desc': "Crédits à l'inscription, puis payant",
    'access.freemium': 'Palier gratuit',
    'access.freemium.desc': 'Version gratuite limitée en débit',
    'access.local': '100 % local',
    'access.local.desc': 'Aucune API, tourne sur ta machine',

    'model.text': 'Texte',
    'model.image': 'Image',
    'model.video': 'Vidéo',
    'model.audio': 'Audio',
    'model.code': 'Code',
    'model.embedding': 'Embeddings',
    'model.rerank': 'Reranking',

    'req.signup': 'Inscription',
    'req.card': 'Carte bancaire',
    'req.phone': 'Téléphone',
    'req.noSignup': 'Sans inscription',
    'req.noCard': 'Sans carte bancaire',
    'req.noPhone': 'Sans téléphone',

    'provider.freeAccess': "Type d'accès gratuit",
    'provider.models': 'Modèles fournis',
    'provider.requirements': 'À fournir',
    'provider.quotas': 'Quotas connus',
    'provider.tags': 'Tags',
    'provider.verifiedAt': 'Vérifié le',
    'provider.visit': 'Ouvrir le site officiel',
    'provider.openai': 'API compatible OpenAI',
    'provider.compatible': 'Compatible',
    'provider.notCompatible': 'Format propriétaire',
    'provider.back': 'Retour aux fournisseurs',
    'provider.relatedAgents': 'Agents compatibles',
    'provider.relatedNews': 'Actualités liées',
    'provider.disclaimer':
      "Les conditions évoluent souvent. Vérifie toujours les quotas sur le site du fournisseur avant de t'engager.",

    'agents.title': 'Agents open source',
    'agents.lead':
      "Des agents que tu peux installer, auditer et faire tourner toi-même, souvent branchés sur les fournisseurs gratuits.",
    'agents.filterCategory': 'Catégorie',
    'agents.worksWith': 'Fonctionne avec',
    'agents.count': 'agents',
    'agents.empty': 'Aucun agent ne correspond à ces filtres.',
    'agents.viewRepo': 'Voir le dépôt',

    'category.coding': 'Agent de code',
    'category.chat': 'Interface de chat',
    'category.automation': 'Automatisation',
    'category.framework': 'Framework',
    'category.local': 'Exécution locale',

    'agent.repository': 'Dépôt',
    'agent.author': 'Éditeur',
    'agent.license': 'Licence',
    'agent.worksWith': 'Fonctionne avec',
    'agent.back': 'Retour aux agents',
    'agent.visit': 'Ouvrir le dépôt',

    'news.title': 'Actualités',
    'news.lead':
      "Nouveaux paliers gratuits, changements de quotas, services qui ferment. Le fil chronologique de l'IA gratuite.",
    'news.readMore': 'Lire la suite',
    'news.back': 'Retour aux actualités',
    'news.relatedProviders': 'Fournisseurs concernés',
    'news.empty': 'Aucune actualité pour le moment.',
    'news.count': 'actualités',
    'news.rss': 'Flux RSS',

    'newstype.new': 'Nouveau',
    'newstype.change': 'Changement',
    'newstype.shutdown': 'Fin de service',
    'newstype.release': 'Sortie',

    'compare.title': 'Comparer les fournisseurs',
    'compare.lead':
      "Sélectionne des fournisseurs pour les mettre côte à côte. Tout se passe dans ton navigateur, rien n'est envoyé.",
    'compare.select': 'Ajouter un fournisseur',
    'compare.selected': 'Sélection',
    'compare.clear': 'Vider',
    'compare.feature': 'Critère',
    'compare.empty':
      "Ta sélection est vide. Choisis au moins deux fournisseurs ci-dessus pour lancer la comparaison.",
    'compare.need': 'Choisis au moins deux fournisseurs pour comparer.',
    'compare.remove': 'Retirer',

    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.verified': 'Vérifié le',
    'common.language': 'Langue',
    'common.updated': 'Mis à jour le',
    'common.filter': 'Filtrer',

    'footer.tagline': 'Annuaire indépendant des modèles gratuits et des agents ouverts.',
    'footer.nav': 'Navigation',
    'footer.legal': 'Informations',
    'footer.disclaimer':
      "Act-Free AI est un annuaire indépendant, sans lien avec les fournisseurs cités. Les marques appartiennent à leurs propriétaires.",
    'footer.builtWith': 'Site statique généré avec Astro, hébergé sur Netlify.',
  },

  en: {
    'site.name': 'Act-Free AI',
    'site.tagline': 'Free models, open agents',
    'site.description':
      'A directory of providers that give free access to AI models, and of open source agents that use them. Every entry is dated and verified.',

    'nav.home': 'Home',
    'nav.providers': 'Providers',
    'nav.agents': 'Agents',
    'nav.news': 'News',
    'nav.compare': 'Compare',
    'nav.menu': 'Menu',

    'home.eyebrow': 'Verified directory',
    'home.title': 'Free AI, catalogued and verified.',
    'home.lead':
      'Which providers really give you access to models without paying? Which open source agents put them to work? It is all here, with the date each entry was last checked.',
    'home.ctaProviders': 'Browse providers',
    'home.ctaNews': 'Read the news',
    'home.statProviders': 'Providers listed',
    'home.statAgents': 'Open source agents',
    'home.statNews': 'News published',
    'home.featured': 'Featured',
    'home.featuredLead': 'The most generous free access right now.',
    'home.latest': 'Latest news',
    'home.viewAll': 'View all',
    'home.agentsTitle': 'Open source agents',
    'home.agentsLead':
      'Agents you can install yourself and point at the free providers above.',
    'home.aboutTitle': 'How it works',
    'home.aboutBody':
      'Each provider entry lists the type of free access, the models available, what signup requires and the known quotas. Each agent entry lists the repository, the licence and compatible providers. Things change fast: the verification date is always shown, and nothing replaces reading the official terms yourself.',

    'providers.title': 'Providers of free models',
    'providers.lead':
      'Platforms and APIs that give access to models at no cost. Filter by what you can accept: card, phone, quotas.',
    'providers.search': 'Search a provider, a model, a tag…',
    'providers.filterAccess': 'Access type',
    'providers.filterModels': 'Model type',
    'providers.filterRequirements': 'Requirements',
    'providers.filterAll': 'All',
    'providers.reset': 'Reset',
    'providers.results': 'result',
    'providers.resultsPlural': 'results',
    'providers.empty': 'No provider matches these filters.',
    'providers.count': 'providers',

    'access.unlimited': 'Lasting free',
    'access.unlimited.desc': 'No announced time limit',
    'access.credits': 'Signup credits',
    'access.credits.desc': 'Credits at signup, then paid',
    'access.freemium': 'Free tier',
    'access.freemium.desc': 'Free but rate limited',
    'access.local': 'Fully local',
    'access.local.desc': 'No API, runs on your machine',

    'model.text': 'Text',
    'model.image': 'Image',
    'model.video': 'Video',
    'model.audio': 'Audio',
    'model.code': 'Code',
    'model.embedding': 'Embeddings',
    'model.rerank': 'Reranking',

    'req.signup': 'Signup',
    'req.card': 'Credit card',
    'req.phone': 'Phone',
    'req.noSignup': 'No signup',
    'req.noCard': 'No credit card',
    'req.noPhone': 'No phone',

    'provider.freeAccess': 'Type of free access',
    'provider.models': 'Models offered',
    'provider.requirements': 'What you need',
    'provider.quotas': 'Known quotas',
    'provider.tags': 'Tags',
    'provider.verifiedAt': 'Verified on',
    'provider.visit': 'Open the official site',
    'provider.openai': 'OpenAI-compatible API',
    'provider.compatible': 'Compatible',
    'provider.notCompatible': 'Proprietary format',
    'provider.back': 'Back to providers',
    'provider.relatedAgents': 'Compatible agents',
    'provider.relatedNews': 'Related news',
    'provider.disclaimer':
      'Terms change often. Always check the quotas on the provider site before committing.',

    'agents.title': 'Open source agents',
    'agents.lead':
      'Agents you can install, audit and run yourself, often pointed at the free providers.',
    'agents.filterCategory': 'Category',
    'agents.worksWith': 'Works with',
    'agents.count': 'agents',
    'agents.empty': 'No agent matches these filters.',
    'agents.viewRepo': 'View repository',

    'category.coding': 'Coding agent',
    'category.chat': 'Chat interface',
    'category.automation': 'Automation',
    'category.framework': 'Framework',
    'category.local': 'Local runtime',

    'agent.repository': 'Repository',
    'agent.author': 'Publisher',
    'agent.license': 'Licence',
    'agent.worksWith': 'Works with',
    'agent.back': 'Back to agents',
    'agent.visit': 'Open the repository',

    'news.title': 'News',
    'news.lead':
      'New free tiers, quota changes, services shutting down. The timeline of free AI.',
    'news.readMore': 'Read more',
    'news.back': 'Back to news',
    'news.relatedProviders': 'Providers involved',
    'news.empty': 'No news yet.',
    'news.count': 'news items',
    'news.rss': 'RSS feed',

    'newstype.new': 'New',
    'newstype.change': 'Change',
    'newstype.shutdown': 'Shutdown',
    'newstype.release': 'Release',

    'compare.title': 'Compare providers',
    'compare.lead':
      'Pick providers and see them side by side. Everything happens in your browser, nothing is sent anywhere.',
    'compare.select': 'Add a provider',
    'compare.selected': 'Selection',
    'compare.clear': 'Clear',
    'compare.feature': 'Criteria',
    'compare.empty':
      'Your selection is empty. Pick at least two providers above to start comparing.',
    'compare.need': 'Pick at least two providers to compare.',
    'compare.remove': 'Remove',

    'common.yes': 'Yes',
    'common.no': 'No',
    'common.verified': 'Verified on',
    'common.language': 'Language',
    'common.updated': 'Updated on',
    'common.filter': 'Filter',

    'footer.tagline': 'An independent directory of free models and open agents.',
    'footer.nav': 'Navigation',
    'footer.legal': 'Information',
    'footer.disclaimer':
      'Act-Free AI is an independent directory, not affiliated with the providers listed. Trademarks belong to their owners.',
    'footer.builtWith': 'Static site built with Astro, hosted on Netlify.',
  },
} as const;

export type UIKey = keyof (typeof ui)['fr'];
