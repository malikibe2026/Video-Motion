// Penggunaan: node render.mjs <data.csv> <output.mp4> [fps=30]
// Baca CSV, suntik ke halaman, render bingkai demi bingkai dan hantar ke ffmpeg.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const [csvPath, outPath, fpsArg] = process.argv.slice(2);
if (!csvPath || !outPath) { console.error('Guna: node render.mjs <data.csv> <output.mp4> [fps]'); process.exit(1); }
const fps = Number(fpsArg || 30);
const here = dirname(fileURLToPath(import.meta.url));

// Parse CSV dan sahkan: berhenti jika ada nilai kosong atau bukan nombor (ikut peraturan templat).
const lines = readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const head = lines.shift().split(',').map(s => s.trim());
const need = ['negeri', 'tahun', 'penduduk_ribu'];
if (need.some(k => !head.includes(k))) { console.error(`Lajur diperlukan: ${need.join(', ')}`); process.exit(2); }
const rows = lines.map((l, i) => {
  const c = l.split(',').map(s => s.trim());
  const r = Object.fromEntries(head.map((h, k) => [h, c[k]]));
  if (!r.negeri || r.tahun === '' || r.penduduk_ribu === '' || r.penduduk_ribu === undefined || Number.isNaN(Number(r.penduduk_ribu))) {
    console.error(`BERHENTI: baris data ${i + 1} (baris fail ${i + 2}) ada nilai kosong atau bukan nombor: "${l}"`);
    console.error('Sila betulkan CSV; tiada angka akan direka.');
    process.exit(3);
  }
  return { negeri: r.negeri, tahun: Number(r.tahun), penduduk_ribu: Number(r.penduduk_ribu), _baris_csv: i + 2 };
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.addInitScript(d => { window.DATA = d; window.__RENDER__ = true; }, rows);
await page.goto(pathToFileURL(join(here, 'index.html')).href);
await page.evaluate(() => window.ready);
const total = await page.evaluate(() => window.TOTAL);
const frames = Math.round(total * fps);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', outPath], { stdio: ['pipe', 'inherit', 'inherit'] });

const contact = [];
const sceneStarts = await page.evaluate(() => window.SCENES.map(s => s.start + Math.min(s.dur - 0.5, 3.0)));
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.draw(t), f / fps);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % (fps * 5) === 0) process.stdout.write(`\r${f}/${frames}`);
}
// Bingkai semakan setiap babak (untuk lembaran kontak)
for (let i = 0; i < sceneStarts.length; i++) {
  await page.evaluate(t => window.draw(t), sceneStarts[i]);
  await page.screenshot({ path: outPath.replace(/\.mp4$/, `-babak${i + 1}.png`) });
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();

// semakan-data.md: setiap angka dalam video dan baris CSV rujukannya
const tahun = [...new Set(rows.map(r => r.tahun))].sort();
const negeri = [...new Set(rows.map(r => r.negeri))];
const L = ['# Semakan data', '', `Fail data: \`${csvPath}\``, '',
  '## Nilai terus daripada CSV', '', '| Negeri | Tahun | Nilai dipaparkan | Baris CSV |', '|---|---|---|---|'];
for (const r of rows) L.push(`| ${r.negeri} | ${r.tahun} | ${r.penduduk_ribu.toLocaleString('en-US')} | ${r._baris_csv} |`);
L.push('', '## Nilai terbitan (dikira)', '', 'Formula: (nilai akhir − nilai awal) ÷ nilai awal × 100', '',
  '| Negeri | Awal | Akhir | Perubahan |', '|---|---|---|---|');
for (const n of negeri) {
  const a = rows.find(r => r.negeri === n && r.tahun === tahun[0]).penduduk_ribu;
  const b = rows.find(r => r.negeri === n && r.tahun === tahun[tahun.length - 1]).penduduk_ribu;
  L.push(`| ${n} | ${a} (${tahun[0]}) | ${b} (${tahun[tahun.length - 1]}) | ${((b - a) / a * 100).toFixed(1)}% |`);
}
writeFileSync(outPath.replace(/\.mp4$/, '-semakan-data.md'), L.join('\n') + '\n');
console.log(`\nSiap: ${outPath} (${total}s, ${fps}fps)`);
