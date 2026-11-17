const fs = require('fs');
const path = require('path');

const svgPath = path.join('assets', 'images', 'loveni_top_card_bg.svg');
const outPath = path.join('assets', 'images', 'loveni_top_card_bg.png');
const svg = fs.readFileSync(svgPath, 'utf8');
const match = svg.match(/href="data:image\/png;base64,([^"]+)"/);

if (!match) {
  console.error('No embedded PNG found in SVG');
  process.exit(1);
}

fs.writeFileSync(outPath, Buffer.from(match[1], 'base64'));
console.log('Wrote', outPath, fs.statSync(outPath).size, 'bytes');
