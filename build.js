/* build.js — minifier sederhana tanpa dependensi (hanya untuk demo).
   Di proyek nyata gunakan cssnano / terser / esbuild.
   Jalankan: node build.js */
const fs = require('fs');

const minCss = s => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

// Catatan: hanya aman bila kode tidak memuat "//" di dalam string/regex (berlaku untuk file demo ini)
const minJs = s => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .split('\n').map(l => l.trim()).filter(Boolean).join('\n');

const jobs = [
  ['before/main.css',       'after/main.min.css',       minCss],
  ['before/components.css', 'after/components.min.css', minCss],
  ['before/analytics.js',   'after/analytics.min.js',   minJs],
  ['after/app.js',          'after/app.min.js',         minJs],
  ['after/chart.js',        'after/chart.min.js',       minJs],
];
for (const [src, out, fn] of jobs) {
  const a = fs.readFileSync(src, 'utf8'), b = fn(a);
  fs.writeFileSync(out, b);
  console.log(`${src.padEnd(24)} ${String(a.length).padStart(6)} B → ${out.padEnd(26)} ${String(b.length).padStart(6)} B  (-${Math.round(100 - b.length / a.length * 100)}%)`);
}

/* ---- Hasilkan after/index.html dari before/index.html ----
   Body IDENTIK (perbandingan adil); hanya <head> yang diubah.
   Critical CSS = main.css (header, hero, tipografi) → di-inline.
   components.css (komponen di bawah fold) → dimuat non-blocking. */
const before = fs.readFileSync('before/index.html', 'utf8');
const body = before.slice(before.indexOf('<body>'));
const critical = fs.readFileSync('after/main.min.css', 'utf8');
const head = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kopi Senja – SESUDAH optimasi</title>

  <!-- 1) Critical CSS inline: tidak ada request CSS di critical path -->
  <style>${critical}</style>

  <!-- 2) CSS non-kritis: preload lalu dipasang sebagai stylesheet saat selesai -->
  <link rel="preload" href="components.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="components.min.css"></noscript>

  <!-- 3) JS tidak lagi memblokir parser -->
  <script src="analytics.min.js" async></script>
  <script src="app.min.js" defer></script>
  <script src="../metrics.js" defer></script>
</head>
`;
fs.writeFileSync('after/index.html', head + body);
console.log('after/index.html dibuat (' + (head + body).length + ' B)');
