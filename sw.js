/* sw.js — Service Worker untuk SIMULASI jaringan lambat di hosting statis (Netlify, GitHub Pages, dll).
   Hanya request ke /before/ dan /after/ yang diperlambat; halaman perbandingan dan metrics.js tidak.
   Cara kerja: respons asli diambil dulu, lalu ditahan sebesar  latency + ukuran/bandwidth  sebelum diberikan ke browser.
   Catatan: ini menambah delay di atas jaringan asli (CDN), bukan menggantikan throttling DevTools. */
const DEFAULT_CFG = { enabled: true, latency: 400, bandwidth: 12 }; // bandwidth dalam byte/ms
const CFG_KEY = 'sim-config';
const BASE = new URL(self.registration.scope).pathname;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'config') return;
  e.waitUntil(
    caches.open('sim').then(c => c.put(CFG_KEY, new Response(JSON.stringify(e.data.config))))
      .then(() => e.ports[0] && e.ports[0].postMessage('ok'))
  );
});

async function getCfg() {
  const c = await caches.open('sim');
  const r = await c.match(CFG_KEY);
  return r ? r.json() : DEFAULT_CFG;
}

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (!u.pathname.startsWith(BASE + 'before/') && !u.pathname.startsWith(BASE + 'after/')) return;
  e.respondWith(handle(e.request));
});

async function handle(req) {
  const cfg = await getCfg();
  const res = await fetch(req, { cache: 'no-store' });   // hindari cache agar tiap run adil
  if (!cfg.enabled || res.type === 'opaqueredirect' || (res.status >= 300 && res.status < 400)) return res;
  const buf = await res.arrayBuffer();
  const delay = cfg.latency + buf.byteLength / cfg.bandwidth;
  await new Promise(r => setTimeout(r, delay));
  return new Response(buf, { status: res.status, statusText: res.statusText, headers: res.headers });
}
