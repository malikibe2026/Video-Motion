# Video: Statistik Tenaga Buruh Terengganu ST3 2026

Video 45 saat, 1080×1920 (9:16), tanpa audio, dibina dengan HyperFrames.

- `out/tenaga-buruh-terengganu-st3-2026.mp4`: video siap
- `data.js`: semua angka (tukar angka di sini untuk suku tahun seterusnya)
- `index.html`: reka letak dan animasi
- `semakan-data.md`: setiap angka dalam video berbanding infografik asal

## Render semula

```bash
mkdir -p vendor && cp ../../hyperframes/node_modules/gsap/dist/gsap.min.js vendor/
../../hyperframes/node_modules/.bin/hyperframes render -o out/tenaga-buruh-terengganu-st3-2026.mp4
```
