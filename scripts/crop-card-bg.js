const fs = require('fs');
const { PNG } = require('pngjs');

const src = PNG.sync.read(fs.readFileSync('assets/images/loveni_top_card_bg.png'));
const { width: w, height: h, data } = src;

const opaque = (x, y) => data[(w * y + x) * 4 + 3] > 8;

let left = w;
let right = 0;
let top = h;
let bottom = 0;

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (!opaque(x, y)) continue;
    if (x < left) left = x;
    if (x > right) right = x;
    if (y < top) top = y;
    if (y > bottom) bottom = y;
  }
}

// tiny padding so soft anti-alias edges aren't clipped harshly
const pad = 2;
left = Math.max(0, left - pad);
top = Math.max(0, top - pad);
right = Math.min(w - 1, right + pad);
bottom = Math.min(h - 1, bottom + pad);

const cw = right - left + 1;
const ch = bottom - top + 1;
const out = new PNG({ width: cw, height: ch });

for (let y = 0; y < ch; y++) {
  for (let x = 0; x < cw; x++) {
    const si = ((top + y) * w + (left + x)) * 4;
    const di = (y * cw + x) * 4;
    out.data[di] = data[si];
    out.data[di + 1] = data[si + 1];
    out.data[di + 2] = data[si + 2];
    out.data[di + 3] = data[si + 3];
  }
}

const outPath = 'assets/images/loveni_top_card_bg.png';
fs.writeFileSync(outPath, PNG.sync.write(out));
console.log('cropped', { left, top, right, bottom, cw, ch, bytes: fs.statSync(outPath).size });
