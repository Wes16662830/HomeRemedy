// One-off icon generator for the PWA. Renders an on-brand SVG to PNGs at the
// sizes a web app manifest needs. Run with Chromium available via playwright:
//   node scripts/gen-icons.mjs
// (playwright-core + a Chromium build are required only to (re)generate icons;
//  the produced PNGs in public/icons are committed, so normal builds don't need it.)
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/icons');
mkdirSync(OUT, { recursive: true });

// Brand palette (matches src/index.css)
const PARCH = '#f1e7d6';
const ACCENT = '#6b4f2a';
const CREAM = '#f3ead6';
const DEEP = '#5b421f';

// The fleuron mark used in the site header, centred. `padFrac` keeps the glyph
// inside the maskable safe area.
function svg({ size, bg, fg, rounded, padFrac }) {
  const fontSize = Math.round(size * (1 - padFrac * 2) * 0.92);
  const radius = rounded ? Math.round(size * 0.18) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${bg}"/>
  <text x="50%" y="50%" dy="0.02em" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" fill="${fg}">&#10087;</text>
</svg>`;
}

const TARGETS = [
  { file: 'icon-192.png', size: 192, bg: PARCH, fg: ACCENT, rounded: true, padFrac: 0.1 },
  { file: 'icon-512.png', size: 512, bg: PARCH, fg: ACCENT, rounded: true, padFrac: 0.1 },
  { file: 'icon-maskable-512.png', size: 512, bg: DEEP, fg: CREAM, rounded: false, padFrac: 0.18 },
  { file: 'apple-touch-icon.png', size: 180, bg: ACCENT, fg: CREAM, rounded: false, padFrac: 0.12 },
];

const pkgMod = await import('/home/user/HomeRemedy/node_modules/playwright-core/index.js');
const pkg = pkgMod.default ?? pkgMod;
const browser = await pkg.chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
try {
  for (const t of TARGETS) {
    const page = await browser.newPage({
      viewport: { width: t.size, height: t.size },
      deviceScaleFactor: 1,
    });
    const markup = svg(t);
    await page.setContent(
      `<!doctype html><html><body style="margin:0">${markup}</body></html>`,
      { waitUntil: 'networkidle' }
    );
    const buf = await page.screenshot({ omitBackground: false });
    writeFileSync(resolve(OUT, t.file), buf);
    // Also keep the raw SVG of the primary mark for reference / scalable use.
    if (t.file === 'icon-512.png') writeFileSync(resolve(OUT, 'icon.svg'), markup);
    await page.close();
    console.log('wrote', t.file, `(${t.size}x${t.size})`);
  }
} finally {
  await browser.close();
}
