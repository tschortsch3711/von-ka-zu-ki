// Generiert public/og-image.png (1200x630) aus dem Kreuzwort-Logo + Wortmarke.
// Reproduzierbar: `node scripts/generate-og-image.cjs`. Rendert SVG -> PNG via sharp.
// Schrift kommt aus dem System (Segoe UI auf Windows); Layout bewusst light-theme,
// passend zur Default-Darstellung der Seite.
const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 630;

// Kreuzwort-Logo (identisch zum favicon.svg, viewBox "2 16 74 73"):
// K.A. waagerecht, I. senkrecht unter dem K, blauer Uebergangspfeil.
const crossword = `
  <text x="17.5" y="42" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">K</text>
  <text x="34"   y="42" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">.</text>
  <text x="50.5" y="42" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">A</text>
  <text x="67"   y="42" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">.</text>
  <text x="17.5" y="84" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">I</text>
  <text x="34"   y="84" text-anchor="middle" font-size="32" font-weight="700" font-family="Segoe UI, Arial, sans-serif" fill="#ffffff">.</text>
  <path d="M 63,48 A 17.5,17.5 0 0,1 44.5,72.6" fill="none" stroke="#589bff" stroke-width="3.5" stroke-linecap="round"/>
  <polyline points="47.0,68.6 42,72 46.0,76.5" fill="none" stroke="#589bff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
`;

// Logo-Badge rechts, vertikal zentriert.
const BADGE = 290;
const BADGE_X = W - 80 - BADGE; // = 830
const BADGE_Y = (H - BADGE) / 2; // = 170
const PAD = BADGE * (1.5 / 32); // proportional zum favicon-Innenabstand
const INNER = BADGE - 2 * PAD;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f8fa"/>
      <stop offset="1" stop-color="#e7f0ff"/>
    </linearGradient>
    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#1f2a44" flood-opacity="0.18"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="10" fill="#1f6feb"/>

  <!-- Textspalte links -->
  <text x="80" y="178" font-size="30" font-weight="700" letter-spacing="4"
        font-family="Segoe UI, Arial, sans-serif" fill="#1f6feb">ANALOGIEBASIERTES KI-GLOSSAR</text>

  <text x="78" y="300" font-size="88" font-weight="800"
        font-family="Segoe UI, Arial, sans-serif" fill="#14171f">Von K.A. zu K.I.</text>

  <text x="80" y="372" font-size="33" font-weight="400"
        font-family="Segoe UI, Arial, sans-serif" fill="#545b6b">Von &#8222;keine Ahnung&#8220; zu kompetenter Einordnung.</text>

  <text x="80" y="468" font-size="31" font-weight="700"
        font-family="Segoe UI, Arial, sans-serif" fill="#14171f">Fachlich korrekt &#8212; in mehreren Perspektiven.</text>

  <text x="80" y="548" font-size="26" font-weight="700"
        font-family="Segoe UI, Arial, sans-serif" fill="#1f6feb">tschortsch3711.github.io/von-ka-zu-ki</text>

  <!-- Logo-Badge rechts -->
  <g filter="url(#badgeShadow)">
    <rect x="${BADGE_X}" y="${BADGE_Y}" width="${BADGE}" height="${BADGE}" rx="${BADGE * 6 / 32}" fill="#161b22"/>
  </g>
  <svg x="${BADGE_X + PAD}" y="${BADGE_Y + PAD}" width="${INNER}" height="${INNER}" viewBox="2 16 74 73">
    ${crossword}
  </svg>
</svg>`;

const out = path.join(__dirname, '..', 'public', 'og-image.png');
sharp(Buffer.from(svg))
  .png()
  .toFile(out)
  .then((info) => console.log('og-image.png:', info.width + 'x' + info.height, info.size + ' bytes'))
  .catch((err) => { console.error(err); process.exit(1); });
