const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.resolve(__dirname, '../public/favicon.svg');
const outDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(svgPath)) {
  console.error("No favicon.svg found!");
  process.exit(1);
}

const sizes = [192, 512];

async function generate() {
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .toFile(path.join(outDir, `pwa-${size}x${size}.png`));
    
    console.log(`Generated pwa-${size}x${size}.png`);
  }
  
  // Maskable icon with safe zone padding
  await sharp(svgPath)
    .resize(400, 400, { fit: 'contain' })
    .extend({
      top: 56, bottom: 56, left: 56, right: 56,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toFile(path.join(outDir, `mask-icon.png`));
    
  console.log(`Generated mask-icon.png`);
  
  // Apple touch icon
  await sharp(svgPath)
    .resize(180, 180)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toFile(path.join(outDir, `apple-touch-icon.png`));
    
  console.log(`Generated apple-touch-icon.png`);
}

generate().catch(console.error);
