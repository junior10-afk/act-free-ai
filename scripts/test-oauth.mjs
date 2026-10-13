// ---------------------------------------------------------------------------
// Tests de la chaine OAuth (netlify/lib/oauth.mjs + les deux fonctions).
//
// Lancer :  node scripts/test-oauth.mjs
//
// On teste la logique purement locale (redirection, cookie d'etat, echappement,
// verification CSRF) en simulant l'appel reseau a GitHub. Aucun secret reel
// n'est necessaire.
// ---------------------------------------------------------------------------

import test from 'node:test';
import assert from 'node:assert/strict';

process.env.GITHUB_OAUTH_CLIENT_ID = 'test-client-id';
process.env.GITHUB_OAUTH_CLIENT_SECRET = 'test-client-secret';
process.env.SITE_URL = 'https://exemple.netlify.app';

const { safeJson, parseCookies, randomToken, ALLOWED_SCOPES } = await import('../netlify/lib/oauth.mjs');
const authHandler = (await import('../netlify/functions/auth.mjs')).default;
const callbackHandler = (await import('../netlify/functions/callback.mjs')).default;

const ORIGIN = 'https://exemple.netlify.app';

function request(path, headers = {}) {
  return new Request(`${ORIGIN}${path}`, { headers });
}

// --- Helpers ---------------------------------------------------------------

test('safeJson neutralise une tentative de fermeture de balise script', () => {
  const out = safeJson({ name: '</script><img src=x onerror=alert(1)>' });
  assert.ok(!out.includes('</script>'), 'la balise fermante doit etre echappee');
  assert.ok(!out.includes('<img'), 'le chevron ouvrant doit etre echappe');
  assert.ok(out.includes('\\u003c'), 'echappement unicode attendu');
});

test('safeJson echappe les separateurs de ligne U+2028 / U+2029', () => {
  const out = safeJson({ a: 'x\u2028y\u2029z' });
  assert.ok(out.includes('\\u2028') && out.includes('\\u2029'));
});

test('randomToken produit des valeurs distinctes et de la bonne longueur', () => {
  const values = new Set(Array.from({ length: 200 }, () => randomToken(32)));
  assert.equal(values.size, 200, 'aucune collision attendue');
  assert.equal(randomToken(32).length, 64);
});

test('parseCookies lit un en-tete Cookie reel', () => {
  const cookies = parseCookies('a=1; decap_oauth_state=abc123; b=2');
  assert.equal(cookies.decap_oauth_state, 'abc123');
});

// --- /auth -----------------------------------------------------------------

test('/auth redirige vers GitHub avec un state et un cookie durci', async () => {
  const response = await authHandler(request('/auth?provider=github&scope=repo'));

  assert.equal(response.status, 302);

  const location = new URL(response.headers.get('location'));
  assert.equal(location.origin, 'https://github.com');
  assert.equal(location.pathname, '/login/oauth/authorize');
  assert.equal(location.searchParams.get('client_id'), 'test-client-id');
  assert.equal(location.searchParams.get('redirect_uri'), `${ORIGIN}/callback`);
  assert.equal(location.searchParams.get('scope'), 'repo');
  assert.equal(location.searchParams.get('allow_signup'), 'false');

  const state = location.searchParams.get('state');
  assert.ok(state && state.length === 64, 'state aleatoire attendu');

  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie.includes('HttpOnly'), 'cookie HttpOnly attendu');
  assert.ok(cookie.includes('Secure'), 'cookie Secure attendu');
  assert.ok(cookie.includes('SameSite=Lax'), 'SameSite=Lax attendu');
  assert.ok(cookie.includes(state), 'le state doit etre depose en cookie');
});

test('/auth refuse une demande d elevation de portee', async () => {
  const response = await authHandler(request('/auth?scope=admin:org,repo'));
  const scope = new URL(response.headers.get('location')).searchParams.get('scope');
  assert.equal(scope, 'repo', 'une portee hors liste blanche doit retomber sur repo');
  assert.ok(!ALLOWED_SCOPES.has('admin:org'));
});

test('/auth accepte une portee legitime transmise par le CMS', async () => {
  const response = await authHandler(request('/auth?scope=public_repo'));
  const scope = new URL(response.headers.get('location')).searchParams.get('scope');
  assert.equal(scope, 'public_repo');
});

// --- /callback -------------------------------------------------------------

test('/callback rejette un state absent sans appeler GitHub', async () => {
  let called = false;
  const original = globalThis.fetch;
  globalThis.fetch = async () => { called = true; return new Response('{}'); };

  const response = await callbackHandler(request('/callback?code=abc'));
  const html = await response.text();

  globalThis.fetch = original;

  assert.equal(called, false, 'aucun appel reseau ne doit partir');
  assert.ok(html.includes('authorization:github:error:'), 'la popup doit recevoir une erreur');
  assert.ok(!html.includes('access_token'));
});

test('/callback rejette un state qui ne correspond pas au cookie (CSRF)', async () => {
  const response = await callbackHandler(
    request('/callback?code=abc&state=attaquant', { cookie: 'decap_oauth_state=victime' })
  );
  const html = await response.text();
  assert.ok(html.includes('authorization:github:error:'));
  assert.ok(!html.includes('gho_'), 'aucun jeton ne doit fuiter');
});

test('/callback renvoie le jeton quand le state est valide', async () => {
  const original = globalThis.fetch;
  let posted = null;
  globalThis.fetch = async (url, options) => {
    posted = JSON.parse(options.body);
    return new Response(JSON.stringify({ access_token: 'gho_fake_token', token_type: 'bearer' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const response = await callbackHandler(
    request('/callback?code=code_valide&state=etat_correct', { cookie: 'decap_oauth_state=etat_correct' })
  );
  const html = await response.text();

  globalThis.fetch = original;

  assert.equal(posted.client_id, 'test-client-id');
  assert.equal(posted.client_secret, 'test-client-secret');
  assert.equal(posted.redirect_uri, `${ORIGIN}/callback`);
  assert.equal(posted.code, 'code_valide');

  assert.ok(html.includes('authorization:github:success:'));
  assert.ok(html.includes('gho_fake_token'));
  assert.ok(!html.includes('test-client-secret'), 'le secret ne doit jamais apparaitre dans la page');
});

test('/callback supprime le cookie d etat et interdit la mise en cache', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ access_token: 'gho_x' }), {
      headers: { 'Content-Type': 'application/json' },
    });

  const response = await callbackHandler(
    request('/callback?code=c&state=s', { cookie: 'decap_oauth_state=s' })
  );
  globalThis.fetch = original;

  assert.match(response.headers.get('set-cookie') || '', /Max-Age=0/);
  assert.match(response.headers.get('cache-control') || '', /no-store/);
});

test('/callback se protege contre une reponse non JSON de GitHub', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('<html>erreur 500</html>', { status: 500 });

  const response = await callbackHandler(
    request('/callback?code=c&state=s', { cookie: 'decap_oauth_state=s' })
  );
  const html = await response.text();
  globalThis.fetch = original;

  assert.ok(html.includes('authorization:github:error:'), 'une reponse non JSON ne doit pas planter');
});

test('/callback relaie le refus explicite de l utilisateur', async () => {
  const response = await callbackHandler(
    request('/callback?error=access_denied&error_description=refus')
  );
  const html = await response.text();
  assert.ok(html.includes('authorization:github:error:'));
});

test('la page de retour porte une CSP a nonce, sans unsafe-inline sur les scripts', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ access_token: 'gho_x' }), {
      headers: { 'Content-Type': 'application/json' },
    });

  const response = await callbackHandler(
    request('/callback?code=c&state=s', { cookie: 'decap_oauth_state=s' })
  );
  globalThis.fetch = original;

  const csp = response.headers.get('content-security-policy') || '';
  assert.match(csp, /script-src 'nonce-[0-9a-f]+'/);
  assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), 'script-src ne doit pas contenir unsafe-inline');
  assert.match(csp, /frame-ancestors 'none'/);
});
