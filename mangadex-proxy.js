// Cloudflare Worker: chuyển tiếp yêu cầu tới MangaDex và thêm CORS.
export default {
  async fetch(req) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const u = new URL(req.url);
    const r = await fetch('https://api.mangadex.org' + u.pathname + u.search, { headers: { 'User-Agent': 'AniViet' } });
    const h = new Headers(r.headers);
    for (const k in cors) h.set(k, cors[k]);
    return new Response(r.body, { status: r.status, headers: h });
  }
};
