// ---------------------------------------------------------------------------
// GET /auth — point d'entree OAuth pour Decap CMS.
//
// Decap ouvre cette URL dans une popup. On genere un `state` imprevisible, on
// le depose dans un cookie HttpOnly, puis on redirige vers GitHub. Le cookie
// sera compare au retour dans /callback (protection CSRF).
//
// Identifiants attendus dans les variables d'environnement Netlify :
//   GITHUB_OAUTH_CLIENT_ID
//   GITHUB_OAUTH_CLIENT_SECRET   (utilise uniquement par /callback)
//   SITE_URL                     ex. https://act-free-ai.netlify.app
// ---------------------------------------------------------------------------

import {
  GITHUB_AUTHORIZE_URL,
  STATE_COOKIE,
  STATE_MAX_AGE,
  ALLOWED_SCOPES,
  readEnv,
  callbackUrl,
  randomToken,
  securityHeaders,
} from '../lib/oauth.mjs';

export const config = { path: '/auth' };

export default async function handler(request) {
  const env = readEnv();
  if (!env) {
    console.error('[oauth] GITHUB_OAUTH_CLIENT_ID ou GITHUB_OAUTH_CLIENT_SECRET manquant');
    return new Response('Configuration OAuth incomplete.', {
      status: 500,
      headers: securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }),
    });
  }

  const url = new URL(request.url);

  // Portee demandee par le CMS. Toute valeur hors liste blanche retombe sur
  // la portee minimale necessaire a l'ecriture dans un depot.
  const requested = url.searchParams.get('scope') || 'repo';
  const requestedScopes = requested.split(/[\s,]+/).filter(Boolean);
  const scope = requestedScopes.every((s) => ALLOWED_SCOPES.has(s))
    ? requestedScopes.join(' ')
    : 'repo';

  const state = randomToken(32);

  const authorize = new URL(GITHUB_AUTHORIZE_URL);
  authorize.searchParams.set('client_id', env.clientId);
  authorize.searchParams.set('redirect_uri', callbackUrl(request));
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);
  // Empeche la creation d'un compte GitHub au detour de cette autorisation.
  authorize.searchParams.set('allow_signup', 'false');

  return new Response(null, {
    status: 302,
    headers: securityHeaders({
      Location: authorize.toString(),
      // SameSite=Lax et non Strict : le retour depuis github.com est une
      // navigation inter-site, et Strict ferait perdre le cookie.
      'Set-Cookie': `${STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${STATE_MAX_AGE}`,
    }),
  });
}
