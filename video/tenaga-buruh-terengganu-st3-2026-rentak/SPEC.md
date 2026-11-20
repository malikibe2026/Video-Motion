# SPEC: Tipografi Rentak (Konsep B)

GOAL:    Penonton ingat "2.8% — penganggur Terengganu terus turun", dan rasa video itu bertenaga walaupun tanpa bunyi.
OUTPUT:  HyperFrames, 1080 x 1920, 30 fps, senyap (dipilih pengguna).
TIME:    41 s = 1230 bingkai. Rentak dalaman 120 BPM = 15 bingkai satu rentak (0.5 s), 1 bar = 4 rentak (2 s).
         Setiap potongan jatuh pada rentak; susun atur bertukar pada bar.
LOOK:    Medium = poster kempen cetak skrin: blok warna rata penuh skrin, tiada gradien, tiada bayang, tiada cahaya.
         Warna: BIRU #0B3D91, PUTIH #FFFFFF, KUNING #FFC72C, HITAM #0A0F1E. Setiap babak = satu warna latar + satu warna tinta.
         Kuning hanya untuk perkara penganggur / 2.8% (makna tetap).
         Angka: League Gothic 400, 520–900 px, tracking -1%. Perkataan: Inter 900, 96–150 px, tracking -3%, huruf besar.
         Teks kecil (label, sumber): Inter 700, 34–44 px. Minimum 30 px.
         Teks penting dalam jalur 200–1400 px dari atas (zon selamat media sosial menegak).
OBJECTS: Grid 1000 petak (40 x 25) = 100% penduduk umur bekerja dalam 0.1%; jalur menegak tenaga buruh (bekerja + penganggur);
         odometer digit (angka berguling dari ST2 ke ST3); anak tangga 3 bar dari paksi sifar.
MOTION:  Masuk: expo.out 0.35–0.5 s. Keluar/zum masuk: power3.in 0.25–0.35 s. Banjir warna: power2.inOut 0.4 s.
         Hentaman angka: skala 1.35 → 1 + blur 14 px → 0 dalam 0.3 s. Whip: 0.25 s dengan blur arah gerakan 20 px.
         Tajuk mendarat lalu DIAM. Satu gerakan utama setiap syot.
SHOTS:
  S1  0.0–3.0   Biru. "2.8%" kuning sudah di skrin pada bingkai 0 (thumbnail); hentaman mendarat 0.3 s. Label "Kadar pengangguran Terengganu · ST3 2026".
                Keluar: 2.8% terbelah dua (atas ke kiri, bawah ke kanan) membuka putih.
  S2  3.0–5.0   Putih. "SIAPA" (rentak 6), "MEREKA?" (rentak 7) hentam satu demi satu. Keluar: banjir kuning dari bawah.
  S3  5.0–10.0  Kuning. Odometer "14.6" → "14.2" RIBU (digit perpuluhan berguling), label ST2 2026 → ST3 2026. "PENGANGGUR". Baris: "turun 0.4 ribu".
                Keluar: whip ke kiri.
  S4  10.0–14.0 Biru. "DARIPADA" kecil, "510.4" kira naik 1.4 s, "RIBU TENAGA BURUH". Keluar: titik perpuluhan membesar menjadi dunia putih.
  S5  14.0–19.0 Putih. Grid 1000 petak, 609 diisi biru baris demi baris → "60.9%" "MENYERTAI TENAGA BURUH", "ST2: 61.3%". Keluar: potong keras pada rentak.
  S6  19.0–25.0 Hitam/biru. Jalur menegak penuh skrin: biru naik 97.2% (496.2 ribu BEKERJA), jalur kuning 2.8% di atas (14.2 ribu).
                Keluar: jalur kuning membesar memenuhi skrin.
  S7  25.0–29.0 Kuning→Putih. "DI LUAR TENAGA BURUH" odometer 323.0 → 327.3 RIBU, "naik 4.3 ribu". Keluar: whip ke atas.
  S8  29.0–34.5 Putih. Tangga ST1 3.2% / ST2 2.9% / ST3 2.8%, bar dari paksi sifar, satu bar satu rentak; ST3 biru, lain kelabu.
                Tajuk: "TERUS MENURUN". Keluar: bar ST3 membesar memenuhi skrin (biru).
  S9  34.5–38.0 Biru. "2.8%" kuning + "TERENDAH SETAKAT INI PADA 2026", perkataan masuk satu demi satu (blur → tajam).
  S10 38.0–41.0 Putih. Jalur biru lap masuk, "JABATAN PERANGKAAN MALAYSIA / NEGERI TERENGGANU", "@StatsMalaysia". Pegang 2 s.
  Garis sumber kecil di bawah (y ≈ 1800) sepanjang video, warna ikut latar.
BANNED:  grid kad KPI (versi 1), setiap babak masuk dengan pudar-naik, semua angka kira naik, latar gelap kosong dengan objek kecil,
         cahaya/glow/zarah, gradien, kad kaca, label sudut, logo di sudut, teks bergerak semasa dibaca, potongan pudar silang antara dunia.
QA:      0.0 (thumbnail ada 2.8%), 4.4, 8.5, 12.5, 17.5, 23.5, 28.0, 33.5, 37.0, 40.5 — setiap satu: angka betul, tiada teks terpotong,
         teks penting dalam jalur 200–1400 px.
