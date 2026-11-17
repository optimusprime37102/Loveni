const fs = require('fs');
const { PNG } = require('pngjs');

const b = fs.readFileSync('assets/images/loveni_top_card_bg.png');
const png = PNG.sync.read(b);
const { width: w, height: h } = png;

const get = (x, y) => {
  const i = (w * y + x) * 4;
  return [png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]];
};

const isNearWhite = ([r, g, b, a]) => a < 20 || (r > 245 && g > 245 && b > 245);
const isLightPink = ([r, g, b]) => r > 230 && g > 200 && b > 210 && r - b < 40;

console.log('size', w, h);
console.log('TL', get(0, 0));
console.log('TR', get(w - 1, 0));
console.log('BL', get(0, h - 1));
console.log('BR', get(w - 1, h - 1));
console.log('center', get(Math.floor(w / 2), Math.floor(h / 2)));

// find content bounds (first non-near-white from each side)
function findLeft() {
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y += 8) {
      if (!isNearWhite(get(x, y))) return x;
    }
  }
  return 0;
}
function findRight() {
  for (let x = w - 1; x >= 0; x--) {
    for (let y = 0; y < h; y += 8) {
      if (!isNearWhite(get(x, y))) return x;
    }
  }
  return w - 1;
}
function findTop() {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x += 8) {
      if (!isNearWhite(get(x, y))) return y;
    }
  }
  return 0;
}
function findBottom() {
  for (let y = h - 1; y >= 0; y--) {
    for (let x = 0; x < w; x += 8) {
      if (!isNearWhite(get(x, y))) return y;
    }
  }
  return h - 1;
}

const left = findLeft();
const right = findRight();
const top = findTop();
const bottom = findBottom();
console.log({ left, right, top, bottom, marginL: left, marginR: w - 1 - right, marginT: top, marginB: h - 1 - bottom });
console.log('sample inset 40', get(40, 40), get(w - 40, h - 40));
console.log('sample inset 80', get(80, 80));
