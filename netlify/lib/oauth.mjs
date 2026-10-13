// ---------------------------------------------------------------------------
// Helpers partages par les fonctions OAuth (auth.mjs / callback.mjs).
//
// Ce fichier n'est PAS expose comme endpoint : il est bundle dans les
// fonctions qui l'importent. Il ne contient aucun secret — les identifiants
// OAuth sont lus dans les variables d'environnement Netlify, jamais ici.
// ---------------------------------------------------------------------------

export const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export const STATE_COOKIE = 'decap_oauth_state';
export const STATE_MAX_AGE = 600; // 10 minutes : large pour un login, court pour un rejeu

// Portees autorisees. Sans cette liste blanche, un appel a
// /auth?scope=admin:org elargirait les droits demandes au nom de l'utilisateur.
export const ALLOWED_SCOPES = new Set(['repo', 'public_repo', 'read:user']);

export function readEnv() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

// Origine publique du site. SITE_URL est prioritaire : en production, l'URL
// de la requete peut passer par un domaine de deploiement preview, et le
// redirect_uri doit rester stable pour correspondre a l'OAuth App.
export function siteOrigin(request) {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function callbackUrl(request) {
  return `${siteOrigin(request)}/callback`;
}

// Aléa cryptographique — Math.random serait devinable et rendrait le `state` inutile.
export function randomToken(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

// Serialise en JS sur pour une insertion dans <script>. Le point critique est
// `<` : sans echappement, une valeur contenant `</script>` fermerait la balise
// et permettrait une injection HTML.
export function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function securityHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Page de retour vers Decap CMS.
//
// Decap ouvre cette page dans une popup et attend un message postMessage au
// format `authorization:<provider>:<status>:<json>`. La popup commence par
// annoncer sa presence, puis repond au premier message de l'ouvreur.
//
// Deux garde-fous par rapport a l'implementation de reference :
//   1. on ne repond qu'aux messages dont l'origine est exactement celle du
//      site — sinon le jeton partirait vers n'importe quelle page ouvrante ;
//   2. une CSP a nonce protege le script inline.
// ---------------------------------------------------------------------------
export function oauthResultPage({ status, payload, origin, provider = 'github' }) {
  const nonce = randomToken(16);
  const message = `authorization:${provider}:${status}:${JSON.stringify(payload)}`;
  const label =
    status === 'success'
      ? 'Connexion reussie. Cette fenetre va se fermer.'
      : 'La connexion a echoue. Cette fenetre va se fermer.';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Authentification</title>
<meta name="robots" content="noindex, nofollow">
<style nonce="${nonce}">
  body { font-family: system-ui, sans-serif; padding: 2rem; color: #23201c; background: #faf8f5; }
</style>
</head>
<body>
<p>${label}</p>
<script nonce="${nonce}">
(function () {
  var message = ${safeJson(message)};
  var expectedOrigin = ${safeJson(origin)};
  function receive(event) {
    if (event.origin !== expectedOrigin) return;
    if (!window.opener) return;
    window.opener.postMessage(message, expectedOrigin);
    window.removeEventListener('message', receive, false);
    setTimeout(function () { window.close(); }, 400);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) {
    window.opener.postMessage('authorizing:${provider}', expectedOrigin);
  }
})();
</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: securityHeaders({
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': `default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; frame-ancestors 'none'`,
      // Le state a servi : on le supprime pour qu'il ne puisse pas etre rejoue.
      'Set-Cookie': `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
    }),
  });
}

export function failurePage(reason, origin) {
  console.error('[oauth] echec :', reason);
  return oauthResultPage({
    status: 'error',
    payload: { message: reason },
    origin,
  });
}
