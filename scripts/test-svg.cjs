const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Deep Midnight Blue -->
    <radialGradient id="bgGlow" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#0f244a" />
      <stop offset="60%" stop-color="#091733" />
      <stop offset="100%" stop-color="#050e20" />
    </radialGradient>

    <!-- Border Gradient: Emerald Teal to Electric Blue -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E599" />
      <stop offset="35%" stop-color="#00C49F" />
      <stop offset="70%" stop-color="#0099FF" />
      <stop offset="100%" stop-color="#0066FF" />
    </linearGradient>

    <!-- Human Figure Green Gradient -->
    <linearGradient id="humanGrad" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#38EF7D" />
      <stop offset="60%" stop-color="#11D473" />
      <stop offset="100%" stop-color="#05B35C" />
    </linearGradient>

    <!-- Leaf / Petal Blue Gradient -->
    <linearGradient id="leafGrad" x1="10%" y1="10%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#38E1FF" />
      <stop offset="45%" stop-color="#00A2FF" />
      <stop offset="100%" stop-color="#0055FF" />
    </linearGradient>

    <!-- Subtle S Shadow -->
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.45" />
    </filter>

    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#00E599" flood-opacity="0.4" />
    </filter>

    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0099FF" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Base Icon Background (Squircle) -->
  <rect x="18" y="18" width="476" height="476" rx="124" fill="url(#bgGlow)" />

  <!-- Gradient Outer Border -->
  <rect x="18" y="18" width="476" height="476" rx="124" fill="none" stroke="url(#borderGrad)" stroke-width="14" stroke-opacity="0.95" />

  <!-- Inner Soft Accent Border / Rim -->
  <rect x="25" y="25" width="462" height="462" rx="118" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.1" />

  <!-- Main Central Brand Symbol (S with Human and Leaf elements) -->
  <g filter="url(#softShadow)">
    <!-- The White 'S' Shape -->
    <!-- Precisely traced modern curved S geometry -->
    <path d="
      M 252 92
      C 176 92, 128 138, 128 208
      C 128 238, 142 265, 168 284
      C 188 298, 218 310, 258 322
      C 305 336, 328 352, 328 382
      C 328 418, 296 442, 246 442
      C 192 442, 154 412, 144 366
      L 76 376
      C 90 452, 154 502, 246 502
      C 338 502, 396 450, 396 378
      C 396 342, 380 312, 350 292
      C 328 276, 294 264, 252 250
      C 212 236, 194 222, 194 198
      C 194 168, 220 148, 258 148
      C 292 148, 318 162, 332 188
      L 336 194
      L 388 152
      C 356 112, 310 92, 252 92
      Z
    " fill="#FFFFFF" transform="matrix(0.82 0 0 0.82 46 42)" />

    <!-- Stylized Human Figure (Green) in Upper Right of S -->
    <g transform="matrix(0.82 0 0 0.82 46 42)">
      <!-- Head -->
      <circle cx="362" cy="142" r="22" fill="url(#humanGrad)" filter="url(#glowGreen)" />
      <!-- Body & Raised Arms (Embracing curve) -->
      <path d="
        M 362 174
        C 342 174, 316 160, 298 144
        C 306 172, 326 210, 348 226
        C 358 214, 372 196, 382 178
        C 404 154, 420 144, 420 144
        C 400 156, 378 174, 362 174
        Z
      " fill="url(#humanGrad)" />
    </g>

    <!-- Stylized Leaf / Medical Teardrop (Blue) in Lower Right of S -->
    <g transform="matrix(0.82 0 0 0.82 46 42)">
      <path d="
        M 264 424
        C 294 424, 342 396, 378 344
        C 378 382, 350 432, 302 452
        C 280 460, 260 462, 246 462
        C 248 450, 254 436, 264 424
        Z
      " fill="url(#leafGrad)" filter="url(#glowBlue)" />
      <!-- Leaf Inner Highlight Line -->
      <path d="
        M 276 430
        C 310 416, 344 380, 362 356
      " fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-opacity="0.6" />
    </g>
  </g>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent.trim());
console.log("SVG written successfully");

sharp(Buffer.from(svgContent))
  .resize(512, 512)
  .png()
  .toFile(path.join(__dirname, '../public/pwa-512x512.png'))
  .then(() => console.log("pwa-512x512.png generated"));
