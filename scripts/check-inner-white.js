const fs = require('fs');
const { PNG } = require('pngjs');
const png = PNG.sync.read(fs.readFileSync('assets/images/loveni_top_card_bg.png'));
const { width: w, height: h, data } = png;
const get = (x, y) => {
  const i = (w * y + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};
console.log('size', w, h);
console.log('corners', get(0, 0), get(w - 1, 0), get(0, h - 1), get(w - 1, h - 1));
console.log('near edge', get(5, Math.floor(h / 2)), get(Math.floor(w / 2), 5));
console.log('center', get(Math.floor(w / 2), Math.floor(h / 2)));

// count near-white opaque pixels near border band
let whiteish = 0;
let total = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const onEdge = x < 12 || y < 12 || x >= w - 12 || y >= h - 12;
    if (!onEdge) continue;
    total++;
    const [r, g, b, a] = get(x, y);
    if (a > 200 && r > 248 && g > 248 && b > 248) whiteish++;
  }
}
console.log({ whiteish, total, pct: ((whiteish / total) * 100).toFixed(2) });
