// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://act-free-ai.netlify.app',
  integrations: [sitemap()],

  // Polices auto-hébergées : aucun appel à Google au chargement, et la CSP
  // peut rester stricte puisqu'il n'y a plus aucune ressource externe.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
  ],

  // Astro calcule les hachages des scripts et styles inline et injecte
  // lui-même la Content-Security-Policy.
  //
  // Seule exception : les attributs `style="..."`, qui sont routés vers
  // `style-src-attr` avec 'unsafe-inline'. Un attribut de style ne peut pas
  // exécuter de code, le risque résiduel se limite à du maquillage d'interface
  // (déjà couvert par X-Frame-Options). En revanche `script-src` et les blocs
  // <style> restent strictement limités à 'self' plus leurs hachages, ce qui
  // est là que se joue réellement la protection contre l'injection.
  security: {
    csp: {
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },

  build: {
    format: 'directory',
  },

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
