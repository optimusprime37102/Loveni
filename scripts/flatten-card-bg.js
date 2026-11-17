const fs = require('fs');
const { PNG } = require('pngjs');

const png = PNG.sync.read(fs.readFileSync('assets/images/loveni_top_card_bg.png'));
const { width: w, height: h, data } = png;

// Sample a stable pink from the upper middle (soft top fill of the card art)
const sx = Math.floor(w / 2);
const sy = Math.floor(h * 0.18);
const si = (w * sy + sx) * 4;
const fill = [data[si], data[si + 1], data[si + 2], 255];
console.log('fill color', fill);

for (let i = 0; i < data.length; i += 4) {
  const a = data[i + 3];
  if (a >= 250) continue;
  if (a === 0) {
    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = 255;
    continue;
  }
  // premultiply soft edges onto fill
  const t = a / 255;
  data[i] = Math.round(data[i] * t + fill[0] * (1 - t));
  data[i + 1] = Math.round(data[i + 1] * t + fill[1] * (1 - t));
  data[i + 2] = Math.round(data[i + 2] * t + fill[2] * (1 - t));
  data[i + 3] = 255;
}

fs.writeFileSync('assets/images/loveni_top_card_bg.png', PNG.sync.write(png));
console.log('flattened', fs.statSync('assets/images/loveni_top_card_bg.png').size);
