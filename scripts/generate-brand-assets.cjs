const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgMaster = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Radial Glow -->
    <radialGradient id="bgGradient" cx="42%" cy="38%" r="68%">
      <stop offset="0%" stop-color="#0e2347" />
      <stop offset="45%" stop-color="#081734" />
      <stop offset="85%" stop-color="#040c1d" />
      <stop offset="100%" stop-color="#020712" />
    </radialGradient>

    <!-- Outer Border Gradient (Emerald Green to Electric Cyan to Royal Blue) -->
    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E599" />
      <stop offset="28%" stop-color="#00D2B4" />
      <stop offset="60%" stop-color="#00A2FF" />
      <stop offset="100%" stop-color="#0062FF" />
    </linearGradient>

    <!-- Subtle Bevel / Ambient Top Light on S -->
    <linearGradient id="sGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="85%" stop-color="#F4F8FC" />
      <stop offset="100%" stop-color="#E2EDF7" />
    </linearGradient>

    <!-- Human Figure Green Gradient -->
    <linearGradient id="humanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2EF28D" />
      <stop offset="50%" stop-color="#00D678" />
      <stop offset="100%" stop-color="#00A859" />
    </linearGradient>

    <!-- Medical / Health Leaf Blue Gradient -->
    <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#40E0D0" />
      <stop offset="30%" stop-color="#00C3FF" />
      <stop offset="75%" stop-color="#0080FF" />
      <stop offset="100%" stop-color="#0052E0" />
    </linearGradient>

    <!-- Drop Shadows for 3D realism -->
    <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.5" />
    </filter>

    <filter id="elementGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Base Squircle Container -->
  <rect x="16" y="16" width="480" height="480" rx="126" fill="url(#bgGradient)" />

  <!-- Outer Border Ring -->
  <rect x="16" y="16" width="480" height="480" rx="126" fill="none" stroke="url(#borderGradient)" stroke-width="16" stroke-opacity="0.95" />

  <!-- Inner Soft Accent Rim -->
  <rect x="25" y="25" width="462" height="462" rx="117" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-opacity="0.12" />

  <!-- Central Emblem Group -->
  <g filter="url(#logoShadow)">
    <!-- White Letter 'S' - Organic & Medical Grade Curvature -->
    <path d="
      M 252 90
      C 178 90, 126 138, 126 210
      C 126 242, 142 270, 172 290
      C 194 304, 226 316, 266 328
      C 314 342, 336 360, 336 392
      C 336 430, 302 454, 248 454
      C 192 454, 150 422, 138 372
      L 68 382
      C 84 462, 152 514, 248 514
      C 346 514, 408 460, 408 386
      C 408 348, 388 316, 354 294
      C 330 278, 292 264, 248 250
      C 204 236, 186 220, 186 196
      C 186 164, 214 144, 252 144
      C 288 144, 316 160, 330 188
      L 334 194
      L 394 150
      C 360 110, 312 90, 252 90
      Z
    " fill="url(#sGrad)" transform="matrix(0.81 0 0 0.81 48 44)" />

    <!-- Human Figure (Green) in Upper Right of S -->
    <g transform="matrix(0.81 0 0 0.81 48 44)" filter="url(#elementGlow)">
      <!-- Head Disc -->
      <circle cx="364" cy="142" r="22.5" fill="url(#humanGrad)" />
      
      <!-- Torso with Welcoming Reaching Arms -->
      <path d="
        M 364 172
        C 344 172, 318 158, 298 142
        C 306 172, 326 210, 348 226
        C 358 214, 372 196, 384 176
        C 406 152, 422 142, 422 142
        C 402 154, 380 172, 364 172
        Z
      " fill="url(#humanGrad)" />
    </g>

    <!-- Stylized Leaf / Medical Petal (Blue) in Lower Right of S -->
    <g transform="matrix(0.81 0 0 0.81 48 44)" filter="url(#elementGlow)">
      <path d="
        M 262 432
        C 294 432, 344 402, 382 346
        C 382 386, 352 440, 302 462
        C 280 470, 258 472, 244 472
        C 246 458, 252 444, 262 432
        Z
      " fill="url(#leafGrad)" />
      
      <!-- Inner Vein Accent on Leaf -->
      <path d="
        M 276 438
        C 312 422, 348 384, 366 358
      " fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.75" />
    </g>
  </g>
</svg>
`;

const publicDir = path.resolve(__dirname, '../public');

async function buildBrandAssets() {
  console.log("Generating brand assets...");

  // 1. Save master SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgMaster.trim());
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgMaster.trim());
  console.log("✔ Saved favicon.svg & logo.svg");

  const svgBuffer = Buffer.from(svgMaster);

  // 2. High-res Logo PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log("✔ Generated logo.png (512x512)");

  // 3. PWA Icons
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log("✔ Generated pwa-512x512.png");

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log("✔ Generated pwa-192x192.png");

  // 4. Apple Touch Icon (180x180 with solid background)
  await sharp(svgBuffer)
    .resize(180, 180)
    .flatten({ background: { r: 8, g: 20, b: 44 } })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log("✔ Generated apple-touch-icon.png (180x180)");

  // 5. Maskable Icon (512x512 with safe-zone margin of ~15%)
  await sharp(svgBuffer)
    .resize(410, 410, { fit: 'contain' })
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: { r: 8, g: 20, b: 44, alpha: 1 }
    })
    .png()
    .toFile(path.join(publicDir, 'mask-icon.png'));
  console.log("✔ Generated mask-icon.png (Maskable with 15% safe margin)");

  // 6. Favicon PNG fallbacks
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon-64.png'));

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));
  console.log("✔ Generated favicon PNG fallbacks");

  console.log("All brand assets successfully built!");
}

buildBrandAssets().catch(err => {
  console.error("Error generating brand assets:", err);
  process.exit(1);
});
