# Templat Prompt: Video Statistik Rasmi

Templat untuk meminta AI (contoh: Claude Code) menjana video animasi data sebagai kod
(HTML + Canvas/SVG), sesuai untuk pembentangan jabatan kerajaan.

Struktur dipinjam daripada pola `<inputs>` / `<rules>` / `<structure>` / `<export>`
dalam `awesome-opus5-5-videos` (lihat `verbove-268381` dan `rossaxbt-707651`), tetapi
gaya dan kawalan data diubah untuk kegunaan rasmi.

## Cara guna

1. Sediakan fail data **CSV** (ada ruangan: label, nilai, tahun/tempoh).
2. Letak CSV dalam folder kerja yang sama dengan AI.
3. Salin blok **PROMPT** di bawah, isi bahagian `[...]`, dan hantar kepada AI.
4. Semak setiap angka dalam video dengan CSV sebelum dikongsi (lihat Senarai Semak).

---

## PROMPT

```
<peranan>
Anda membina video animasi data sepenuhnya dalam kod untuk pembentangan rasmi sebuah
jabatan kerajaan Malaysia. Ketepatan data lebih penting daripada kesan visual.
</peranan>

<input>
Baca fail data ini: [nama_fail.csv]
Sebelum membina apa-apa, tanya saya perkara berikut yang belum dinyatakan:
- Tajuk video dan satu mesej utama (satu ayat)
- Tempoh rujukan data (contoh: 2020–2024) dan unit (contoh: ribu orang, %)
- Sumber data untuk dipaparkan (contoh: "Jabatan Perangkaan Malaysia, Banci 2020")
- 3 hingga 6 angka utama yang mesti diserlahkan
- Format: 16:9 (pembentangan), 9:16 (WhatsApp), atau 1:1
- Bahasa teks pada skrin: Bahasa Malaysia (lalai)
</input>

<peraturan_data>
Guna HANYA nilai dalam fail CSV. Jangan cari, anggar, bundar atau reka sebarang angka.
Jika ada nilai hilang atau meragukan, berhenti dan tanya saya.
Setiap angka yang dipaparkan mesti boleh dijejak kepada satu baris CSV.
Paparkan sumber dan tempoh rujukan pada skrin sepanjang video (teks kecil, bawah).
Paksi graf bermula pada sifar untuk carta bar. Jangan potong paksi.
Gunakan format nombor Malaysia: pemisah ribu koma, perpuluhan titik (contoh: 1,234.5).
Selepas siap, hasilkan fail `semakan-data.md`: jadual setiap angka dalam video,
nilai asal dalam CSV, dan baris CSV rujukannya.
</peraturan_data>

<gaya>
Formal, bersih, tenang. Latar putih atau kelabu sangat cerah, teks gelap.
Satu warna aksen sahaja ([kod warna jabatan, contoh #0B3D91]) dan satu warna kelabu.
Fon sans-serif yang jelas dibaca (contoh: Inter atau Noto Sans). Saiz teks minimum
28px pada 1080p supaya boleh dibaca dari belakang bilik.
Tiada kesan tular: tiada gegaran, tiada kilauan, tiada letupan zarah.
Pergerakan perlahan dan mudah: carta tumbuh, nombor mengira naik, satu penyerlahan
pada satu masa.
</gaya>

<struktur>
Tempoh: [30–90] saat, mana-mana lebih pendek yang cukup.
1. Tajuk dan tempoh rujukan (3 saat)
2. Konteks: satu ayat yang menerangkan topik
3. Angka utama, satu demi satu, setiap satu dengan carta ringkas dan label jelas
4. Perbandingan atau trend utama (satu carta sahaja, jangan padat)
5. Kesimpulan: mesej utama dalam satu ayat
6. Penutup: sumber data, nama jabatan, tarikh
Setiap babak sekurang-kurangnya 4 saat supaya sempat dibaca.
</struktur>

<teknikal>
Satu fail HTML, satu canvas (atau SVG), fungsi draw(t) tulen tanpa keadaan
dibawa antara bingkai supaya boleh dirender semula bingkai demi bingkai.
Tiada audio melainkan saya minta.
Kod mesti boleh diedit: pisahkan data (baca dari CSV) daripada animasi.
</teknikal>

<eksport>
1. Render satu bingkai pada setiap babak sebagai lembaran kontak. Semak teks tidak
   bertindih dan tidak terpotong, dan baiki jika ada masalah.
2. Render semua bingkai dalam Chrome tanpa kepala pada 30fps (cukup untuk
   pembentangan), simpan sebagai MP4 H.264 yuv420p.
3. Hantar: fail MP4, fail HTML sumber, `semakan-data.md`.
</eksport>

<akhir>
Beritahu saya keputusan yang anda buat sendiri, dan apa-apa yang anda tidak pasti.
Jangan dakwa data betul tanpa jadual semakan.
</akhir>
```

---

## Senarai semak sebelum kongsi video

- [ ] Setiap angka dalam video sepadan dengan `semakan-data.md` dan CSV asal
- [ ] Unit, tahun/tempoh dan sumber dipaparkan dengan betul
- [ ] Paksi carta tidak mengelirukan (bar bermula dari sifar)
- [ ] Teks tidak bertindih atau terpotong, boleh dibaca pada skrin projektor
- [ ] Ejaan dan istilah teknikal betul (semak oleh rakan sekerja)
- [ ] Data yang sensitif atau belum diterbitkan tiada (rujuk pegawai penyelia)
- [ ] Kelulusan dalaman untuk penerbitan, jika diperlukan

## Had yang perlu diingat

- Templat ini belum diuji dengan agen sebenar. Kualiti bergantung pada agen dan
  masa rendering.
- AI masih boleh tersilap membaca CSV atau menulis label. Jadual semakan membantu,
  tetapi tidak menggantikan semakan manusia.
- Jangan muat naik data yang belum diterbitkan atau terperingkat ke perkhidmatan AI
  luar tanpa kebenaran jabatan.
