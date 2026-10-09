# Studi Kasus: Kopi Senja (Render Blocking & CRP)

Website landing page kedai kopi dalam dua versi dengan konten **identik**:

| Folder    | Keterangan |
|-----------|------------|
| `before/` | `<head>` berisi 2 CSS + 2 JS sinkron, semua fitur JS dimuat di awal |
| `after/`  | critical CSS inline, CSS sisa non-blocking, `async`/`defer`, file `.min`, chart di-code-split |

## Deploy ke Netlify (hosting statis)
Tidak perlu build. Publish folder `case-study/` apa adanya:
- Drag & drop folder `case-study` ke https://app.netlify.com/drop, atau
- `npx netlify deploy --dir=case-study --prod`

File penting: `sw.js` (simulasi), `_headers` (sw.js tidak di-cache), `netlify.toml`.
Jika Netlify menampilkan 401, matikan *Password protection / Visitor access* di Site configuration agar dosen bisa membuka.

## Simulasi perlambatan
Halaman utama (`/`) punya panel kontrol: profil jaringan (Fast 4G, Slow 4G, 3G, Demo lambat, Kustom),
tombol **Muat ulang** dan **Jalankan benchmark** (median dari N run).
Simulasi dilakukan `sw.js` (Service Worker): respons dari `/before/` dan `/after/` ditahan sebesar
`latensi + ukuran ÷ bandwidth`. Butuh HTTPS atau localhost (Netlify sudah HTTPS).

- Biarkan tab **terlihat** saat benchmark; tab di latar belakang menunda paint sehingga FCP tidak valid.
- Delay SW ditambahkan di atas jaringan asli. Untuk validasi independen pilih "Tanpa simulasi", lalu
  DevTools → Network → throttling "Slow 4G" atau Lighthouse pada `/before/` dan `/after/`.
- Setelah SW terdaftar, membuka `/before/` atau `/after/` langsung juga ikut diperlambat. Pilih "Tanpa simulasi" untuk mematikan.

## Menjalankan lokal
```bash
node build.js     # minify + hasilkan after/index.html
node server.js    # http://localhost:3000 (simulasi oleh sw.js)
# opsional delay di sisi server (jangan bersamaan dengan sw.js): THROTTLE=1 node server.js
```
