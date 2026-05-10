import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

async function generate() {
  console.log('Generating SVG...');
  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#060609"/>
  <defs>
    <radialGradient id="grad" cx="50%" cy="0%" r="80%" fx="50%" fy="0%">
      <stop offset="0%" style="stop-color:rgba(0, 217, 255, 0.25);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(0, 217, 255, 0);stop-opacity:1" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#grad)"/>
  
  <!-- Subtle Grid -->
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)" />

  <!-- Content Box -->
  <rect x="300" y="215" width="600" height="220" rx="40" fill="rgba(10,10,15,0.8)" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  
  <text x="600" y="335" font-family="Arial, sans-serif" font-size="120" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-5">FixeQ</text>
  <text x="600" y="390" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#00d9ff" text-anchor="middle" letter-spacing="10">FULL STACK DEVELOPER</text>
</svg>
`;

  console.log('Converting SVG to PNG...');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outPath = path.join(process.cwd(), 'public', 'og-image.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Saved OG Image to ${outPath}`);
}

generate().catch(console.error);
