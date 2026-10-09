/* server.js — static server tanpa dependensi, dengan simulasi jaringan lambat.
   Jalankan: node server.js   (lalu buka http://localhost:3000)
   Simulasi lambat default dilakukan oleh sw.js di browser. Untuk delay di sisi server: THROTTLE=1 node server.js
   (jangan aktifkan keduanya bersamaan — delay akan berlipat).
   Latensi tetap per request + throughput terbatas, agar efek render-blocking terlihat. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const THROTTLE = process.env.THROTTLE === '1';       // default MATI: simulasi dilakukan sw.js (hindari delay ganda)
const LATENCY_MS = +process.env.LATENCY || 400;      // RTT simulasi per request
const BYTES_PER_MS = +process.env.BANDWIDTH || 12;   // ~12 KB/s ≈ jaringan sangat lambat (agar file kecil pun terasa)
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.md': 'text/plain; charset=utf-8' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(__dirname, path.normalize(p));
  if (!file.startsWith(__dirname)) { res.writeHead(403).end(); return; }

  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('Not found'); return; }
    // Halaman compare (root) dan metrics.js tidak disimulasikan lambat
    const throttled = THROTTLE && (p.startsWith('/before/') || p.startsWith('/after/'));
    const delay = throttled ? LATENCY_MS + buf.length / BYTES_PER_MS : 0;
    setTimeout(() => {
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(buf);
      if (throttled) console.log(`${req.url}  ${buf.length} B  +${Math.round(delay)} ms`);
    }, delay);
  });
}).listen(PORT, () => console.log(`Studi kasus: http://localhost:${PORT}  (latency ${LATENCY_MS}ms, ${BYTES_PER_MS} B/ms)`));
