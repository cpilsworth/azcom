// crop.mjs <in.png> <out.png> <x> <y> <w> <h> [scale] — crop (and box-downscale by integer factor)
import fs from 'node:fs'; import { PNG } from 'pngjs';
const [i, o, x, y, w, h, s = 1] = process.argv.slice(2); const src = PNG.sync.read(fs.readFileSync(i));
const X = +x, Y = +y, W = Math.min(+w, src.width - X), H = Math.min(+h, src.height - Y), S = +s;
const out = new PNG({ width: Math.floor(W / S), height: Math.floor(H / S) });
for (let r = 0; r < out.height; r++) for (let c = 0; c < out.width; c++) { const acc = [0, 0, 0, 0];
  for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) { const k = ((Y + r * S + dy) * src.width + X + c * S + dx) * 4; for (let j = 0; j < 4; j++) acc[j] += src.data[k + j]; }
  const k = (r * out.width + c) * 4; for (let j = 0; j < 4; j++) out.data[k + j] = acc[j] / (S * S); }
fs.writeFileSync(o, PNG.sync.write(out)); console.log(o, out.width + 'x' + out.height);
