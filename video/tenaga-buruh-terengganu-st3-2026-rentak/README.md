# Video: Tenaga Buruh Terengganu ST3 2026 — Tipografi Rentak (versi 2)

41 saat, 1080×1920 (9:16), 30 fps, senyap. HyperFrames.
Konsep dan pilihan lain: `STORYLINES.md`. Arahan reka bentuk: `SPEC.md`.
Semakan angka: sama seperti versi 1 (`../tenaga-buruh-terengganu-st3-2026/semakan-data.md`).

- `out/tenaga-buruh-terengganu-st3-2026-rentak.mp4`: video siap
- `data.js`: semua angka (tukar di sini untuk suku tahun seterusnya)
- `index.html`: babak dan animasi

## Render semula

```bash
mkdir -p vendor && cp ../../hyperframes/node_modules/gsap/dist/gsap.min.js vendor/
../../hyperframes/node_modules/.bin/hyperframes render -o out/tenaga-buruh-terengganu-st3-2026-rentak.mp4
```
