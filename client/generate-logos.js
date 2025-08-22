const fs = require('fs');
const path = require('path');

// Simple function to create a basic colored square with text
function createBasicSVG(size, text) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#2563eb" />
    <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${size/6}" fill="white" 
      text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

// Create SVG files
const publicDir = path.join(__dirname, 'public');

// Create logo192.svg
fs.writeFileSync(
  path.join(publicDir, 'logo192.svg'),
  createBasicSVG(192, 'Wingrox AI')
);

// Create logo512.svg
fs.writeFileSync(
  path.join(publicDir, 'logo512.svg'),
  createBasicSVG(512, 'Wingrox AI')
);

// Create favicon SVG
fs.writeFileSync(
  path.join(publicDir, 'favicon.svg'),
  createBasicSVG(64, 'W')
);

console.log('SVG logo files and favicon created successfully in the public directory.');
console.log('To convert these to PNG/ICO format, please install the following packages:');
console.log('npm install sharp');
console.log('Or use an online converter to convert the SVG files to PNG and ICO formats.');
