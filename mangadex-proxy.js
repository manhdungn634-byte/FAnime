// Cloudflare Worker: proxy MangaDex (API + ảnh bìa) và thêm CORS.
export default {
  async fetch(req) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const u = new URL(req.url);
    // Ảnh: /proxy?u=<url ảnh MangaDex>
    if (u.pathname === '/proxy') {
      const t = u.searchParams.get('u') || '';
      let host = '';
      try { host = new URL(t).hostname; } catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
      if (!(host === 'uploads.mangadex.org' || host.endsWith('.mangadex.network'))) {
        return new Response('forbidden', { status: 403, headers: cors });
      }
      const r = await fetch(t, { headers: { 'User-Agent': 'AniViet' }, cf: { cacheEverything: true, cacheTtl: 86400 } });
      const h = new Headers(r.headers);
      for (const k in cors) h.set(k, cors[k]);
      h.set('Cache-Control', 'public, max-age=86400');
      return new Response(r.body, { status: r.status, headers: h });
    }
    // API: chuyển tiếp tới api.mangadex.org
    const r = await fetch('https://api.mangadex.org' + u.pathname + u.search, { headers: { 'User-Agent': 'AniViet' } });
    const h = new Headers(r.headers);
    for (const k in cors) h.set(k, cors[k]);
    return new Response(r.body, { status: r.status, headers: h });
  }
};
