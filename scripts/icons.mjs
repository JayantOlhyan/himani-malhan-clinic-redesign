// Generates PNG app icons from the brand mark. Run: node scripts/icons.mjs (outputs are committed).
import sharp from "sharp";

const mark = (stroke, width) =>
  `<g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"><path d="M20 7C25.5 13.5 25.5 21.5 20 28.5C14.5 21.5 14.5 13.5 20 7Z"/><path d="M20 28.5C13.5 27 9 21.8 8 15.2C13.5 16.2 18 20.8 20 28.5Z"/><path d="M20 28.5C26.5 27 31 21.8 32 15.2C26.5 16.2 22 20.8 20 28.5Z"/><path d="M11.5 32.5C17 34.5 23 34.5 28.5 32.5" stroke-linecap="round"/></g>`;
// Maskable icons keep the mark inside the central 80% safe zone.
const svg = ({ maskable = false } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" ${maskable ? "" : 'rx="7"'} fill="#4a2637"/>${
    maskable ? `<g transform="translate(6 6) scale(0.7)">${mark("#ecdcdc", 1.9)}</g>` : mark("#ecdcdc", 1.5)
  }</svg>`;

const out = [
  ["public/icon-192.png", 192, svg()],
  ["public/icon-512.png", 512, svg()],
  ["public/icon-maskable-512.png", 512, svg({ maskable: true })],
  ["public/apple-icon.png", 180, svg({ maskable: true })],
];
for (const [file, size, s] of out) {
  await sharp(Buffer.from(s), { density: (72 * size) / 40 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(file);
}
