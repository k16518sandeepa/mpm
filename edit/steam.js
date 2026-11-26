// Netlify function: lets the games poster page read Steam store data.
// Steam's store API does not allow direct browser calls, so this relays them.
// Only the three Steam endpoints the page needs are allowed.
exports.handler = async (event) => {
  const raw = event.queryStringParameters && event.queryStringParameters.u;
  let url;
  try { url = new URL(raw); } catch (e) { return { statusCode: 400, body: 'Bad url' }; }
  const allowed =
    url.protocol === 'https:' &&
    url.hostname === 'store.steampowered.com' &&
    /^\/(api\/appdetails|api\/storesearch\/?|appreviews\/\d+)$/.test(url.pathname);
  if (!allowed) return { statusCode: 403, body: 'Not allowed' };
  try {
    const r = await fetch(url, { headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
    return {
      statusCode: r.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      },
      body: await r.text()
    };
  } catch (e) {
    return { statusCode: 502, body: 'Steam unreachable' };
  }
};
