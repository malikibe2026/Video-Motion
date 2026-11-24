# Contoh video: Peringatan Khutbah Jumaat

Contoh video motion graphic yang dihasilkan dengan skill `motion-graphics-by-nalarka`,
berdasarkan infografik "Hakikat Usia, Amanah Harta & Kunci Kejayaan Akhirat".

- Hasil: `out/khutbah-usia-harta.mp4`, iaitu 58 saat, 1080×1920 (potret), 30 fps, 1,740 frame, H.264 + AAC.
- Voiceover: suara AI Microsoft Edge `ms-MY-OsmanNeural` (Bahasa Malaysia). Ia hanya suara contoh, tanpa muzik latar.
- Naskhah: `naskhah.txt`. Masa setiap perkataan diambil daripada `assets/voiceover.words.json`.
- Visual: ilustrasi dipotong daripada `assets/infografik.png`. Semua teks di skrin ditaip semula dengan fon Inter.
  Ejaan "AKOLAH" dalam belon dialog ular telah dibetulkan kepada "AKULAH".

## Render semula

```bash
python3 render.py 58                       # hasilkan frames/00000.png hingga frames/01739.png
ffmpeg -y -framerate 30 -i frames/%05d.png -i assets/voiceover.mp3 \
  -filter_complex "[1:a]adelay=1000:all=1,apad=whole_dur=58,atrim=0:58,asetpts=PTS-STARTPTS,afade=t=out:st=57.5:d=0.5[aout]" \
  -map 0:v -map "[aout]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -frames:v 1740 \
  -c:a aac -b:a 192k -ar 48000 -t 58 -movflags +faststart out/khutbah-usia-harta.mp4
```

Pratonton beberapa frame tertentu: `python3 render.py 58 7.0,25.5,57.9`

Keperluan: Python 3 dengan Pillow, fon Inter di `/usr/share/fonts/opentype/inter/`, dan ffmpeg.

Semakan kandungan: naskhah hanya meringkaskan infografik. Sumber hadis dan ayat belum disemak secara bebas.
