# Motion studio: senarai alat (rujukan sahaja)

Senarai 20 repo sumber terbuka untuk pengeluaran video. Ini **rujukan**, bukan kod yang disalin ke repo ini.

Status "Dalam repo ini" merujuk kepada skill atau alat yang sudah ada dan digunakan di sini. Lain-lain belum dipasang.

Pautan telah diperiksa wujud (`git ls-remote`). Lesen **belum disemak** untuk setiap repo, kecuali yang ditanda.

| # | Nama | Guna untuk | Repo | Status dalam repo ini |
|---|---|---|---|---|
| 01 | Remotion | Video dengan React | https://github.com/remotion-dev/remotion | Tidak dipasang. **Lesen khas** (percuma untuk individu dan syarikat kecil sahaja). Semak dahulu |
| 02 | Remotion Skills | Skill video untuk agen | https://github.com/remotion-dev/skills | Tidak dipasang |
| 03 | Anime.js | Koreografi dengan garis masa | https://github.com/juliangarnier/anime | Tidak dipasang |
| 04 | Motion | Animasi UI dan peralihan susun atur | https://github.com/motiondivision/motion | Tidak dipasang |
| 05 | Manim | Ilustrasi, persamaan, video penerangan | https://github.com/ManimCommunity/manim | Tidak dipasang |
| 06 | Lottie (lottie-web) | Animasi vektor ringan | https://github.com/airbnb/lottie-web | Sudah tersedia dalam `motion-video` (`lib lottie`) |
| 07 | Blender MCP | Claude bina dan edit adegan 3D | https://github.com/ahujasid/blender-mcp | Tidak dipasang. Perlu Blender di mesin anda |
| 08 | Three.js | Adegan 3D dan kamera | https://github.com/mrdoob/three.js | Sudah tersedia dalam `motion-video` (`lib three`) |
| 09 | Three GPU Path Tracer | Cahaya dan pantulan realistik | https://github.com/gkjohnson/three-gpu-pathtracer | Tidak dipasang. Perlukan GPU |
| 10 | Jolt Physics | Pelanggaran dan jasad fizikal | https://github.com/jrouwe/JoltPhysics | Tidak dipasang |
| 11 | postprocessing | Bloom, kedalaman medan, warna | https://github.com/pmndrs/postprocessing | Tidak dipasang |
| 12 | three.quarks | Zarah dan VFX | https://github.com/Alchemist0823/three.quarks | Tidak dipasang |
| 13 | Tweakpane | Laras parameter secara langsung | https://github.com/cocopon/tweakpane | Tidak dipasang |
| 14 | ComfyUI | Aliran kerja AI berasaskan nod | https://github.com/Comfy-Org/ComfyUI | Tidak dipasang. Perlukan GPU kuat |
| 15 | CosyVoice | Narasi berbilang bahasa | https://github.com/FunAudioLLM/CosyVoice | Tidak dipasang. Perlukan GPU dan berat |
| 16 | librosa | Pengesanan rentak untuk segerak muzik | https://github.com/librosa/librosa | Sudah ada fungsi `beats` dalam `motion-video` |
| 17 | WhisperX | Sari kata dengan masa setiap perkataan | https://github.com/m-bain/whisperX | Sudah ada fungsi `transcribe` dalam `motion-video` (Whisper) |
| 18 | OBS Studio | Rakaman skrin | https://github.com/obsproject/obs-studio | Aplikasi desktop pada mesin anda sahaja |
| 19 | LosslessCut | Potong pantas tanpa encode semula | https://github.com/mifi/lossless-cut | Aplikasi desktop pada mesin anda sahaja |
| 20 | FFmpeg | Eksport akhir | https://github.com/FFmpeg/FFmpeg | Sudah digunakan untuk render (dipasang di persekitaran) |

## Nota

- **Yang sudah dilindungi oleh `motion-video`:** FFmpeg, Lottie, Three.js, rentak muzik dan Whisper. Tidak perlu pasang semula.
- **Yang berat:** ComfyUI, CosyVoice, Three GPU Path Tracer dan Blender memerlukan GPU. Persekitaran cloud ini tiada GPU.
- **Yang di mesin anda:** OBS dan LosslessCut ialah aplikasi desktop, bukan skill.
- **Remotion:** sudah diputuskan untuk tidak dipasang kerana lesen khas. Kalau mahu guna, semak kelayakan jabatan dahulu.
- **Lesen:** belum disemak untuk repo selain Remotion. Semak fail `LICENSE` setiap repo sebelum guna untuk kerja rasmi.
- **Bukan semua skill:** kebanyakan repo ini ialah pustaka, bukan skill agen. Hanya nombor 02 (Remotion Skills) yang berbentuk skill.
