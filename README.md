# Studi Kasus: Kopi Senja (Render Blocking & CRP)

Website landing page kedai kopi dalam dua versi dengan konten **identik**:

| Folder    | Keterangan |
|-----------|------------|
| `before/` | `<head>` berisi 2 CSS + 2 JS sinkron, semua fitur JS dimuat di awal |
| `after/`  | critical CSS inline, CSS sisa non-blocking, `async`/`defer`, file `.min`, chart di-code-split |

## Menjalankan
```bash
node build.js     # minify + hasilkan after/index.html (sudah dijalankan)
node server.js    # http://localhost:3000
```
Buka `http://localhost:3000` → dua versi tampil berdampingan dengan FCP masing-masing.
Atur jaringan simulasi: `LATENCY=600 BANDWIDTH=8 node server.js`.

## Verifikasi di DevTools
Buka `/before/` dan `/after/` terpisah → tab Network (waterfall), Performance (FCP/LCP), Coverage, dan Lighthouse.

## Catatan
- `metrics.js` hanya alat ukur demo, bukan bagian optimasi.
- Ukuran file sengaja kecil agar mudah dibaca; efek utama datang dari sifat *blocking*, yang diperbesar oleh latensi simulasi.
- `build.js` adalah minifier sederhana untuk demo; di produksi pakai cssnano/terser/esbuild.
# mid-type-3
