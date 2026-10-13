// ---------------------------------------------------------------------------
// GET /callback — retour depuis GitHub, echange du code contre un jeton.
//
// Le jeton obtenu n'est jamais journalise ni stocke cote serveur : il est
// renvoye une seule fois a la popup Decap CMS, qui le garde en memoire.
// ---------------------------------------------------------------------------

import {
  GITHUB_TOKEN_URL,
  STATE_COOKIE,
  readEnv,
  callbackUrl,
  parseCookies,
  siteOrigin,
  oauthResultPage,
  failurePage,
} from '../lib/oauth.mjs';

export const config = { path: '/callback' };

export default async function handler(request) {
  const origin = siteOrigin(request);
  const url = new URL(request.url);

  const env = readEnv();
  if (!env) return failurePage('Configuration OAuth incomplete.', origin);

  // GitHub renvoie `error` quand l'utilisateur refuse l'autorisation.
  const oauthError = url.searchParams.get('error');
  if (oauthError) {
    const description = url.searchParams.get('error_description') || oauthError;
    return failurePage(`GitHub a refuse l'autorisation (${description}).`, origin);
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = parseCookies(request.headers.get('cookie'))[STATE_COOKIE];

  // Protection CSRF. Sans cette comparaison, un attaquant pourrait faire
  // aboutir une autorisation qu'il a lui-meme initiee et lier son compte
  // GitHub a la session de la victime.
  if (!state || !expectedState || state !== expectedState) {
    return failurePage("Verification d'etat OAuth echouee. Relance la connexion depuis /admin/.", origin);
  }

  if (!code) return failurePage("Code d'autorisation manquant.", origin);

  let data;
  try {
    const response = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.clientId,
        client_secret: env.clientSecret,
        code,
        redirect_uri: callbackUrl(request),
      }),
    });
    data = await response.json();
  } catch (error) {
    console.error('[oauth] echec de l echange de jeton :', error);
    return failurePage("Impossible de joindre GitHub pour echanger le jeton.", origin);
  }

  if (!data || data.error || !data.access_token) {
    // On journalise le detail cote serveur, jamais dans la page renvoyee.
    console.error('[oauth] GitHub a refuse l echange :', data && data.error);
    return failurePage("GitHub a refuse l'echange du jeton.", origin);
  }

  return oauthResultPage({
    status: 'success',
    payload: { token: data.access_token, provider: 'github' },
    origin,
  });
}
