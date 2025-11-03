// Script to generate Chrome extension icons
// Run: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Simple PNG generator without dependencies
// We'll create a minimal PNG using base64 or use a library
// For now, let's try using sharp if available, otherwise fall back to HTML

async function generateIcons() {
  try {
    // Try to use sharp (lighter weight than canvas)
    const sharp = require('sharp');
    await generateWithSharp(sharp);
    console.log('✓ Icons generated successfully using sharp!');
  } catch (e) {
    try {
      // Fall back to canvas
      const { createCanvas } = require('canvas');
      await generateWithCanvas(createCanvas);
      console.log('✓ Icons generated successfully using canvas!');
    } catch (e2) {
      console.log('⚠ Image generation libraries not found.');
      console.log('Please run: npm install sharp');
      console.log('Or: npm install canvas');
      console.log('\nAlternatively, open generate-icons.html in your browser to generate icons.');
      process.exit(1);
    }
  }
}

async function generateWithSharp(sharp) {
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    const svg = createSVGIcon(size);
    await sharp(Buffer.from(svg), { density: 300 })
      .resize(size, size)
      .png()
      .toFile(`icon${size}.png`);
    console.log(`✓ Generated icon${size}.png`);
  }
}

async function generateWithCanvas(createCanvas) {
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    drawIcon(ctx, size);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`icon${size}.png`, buffer);
    console.log(`✓ Generated icon${size}.png`);
  }
}

function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4285F4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <rect x="${size * 0.2}" y="${size * 0.15}" width="${size * 0.6}" height="${size * 0.7}" fill="rgba(255,255,255,0.9)"/>
  <line x1="${size * 0.32}" y1="${size * 0.35}" x2="${size * 0.68}" y2="${size * 0.35}" stroke="rgba(66,133,244,0.3)" stroke-width="${Math.max(1, size / 64)}"/>
  <line x1="${size * 0.32}" y1="${size * 0.5}" x2="${size * 0.68}" y2="${size * 0.5}" stroke="rgba(66,133,244,0.3)" stroke-width="${Math.max(1, size / 64)}"/>
  <line x1="${size * 0.32}" y1="${size * 0.65}" x2="${size * 0.68}" y2="${size * 0.65}" stroke="rgba(66,133,244,0.3)" stroke-width="${Math.max(1, size / 64)}"/>
  <path d="M ${size * 0.65} ${size * 0.35} L ${size * 0.7} ${size * 0.45} L ${size * 0.8} ${size * 0.3}" stroke="#4CAF50" stroke-width="${Math.max(2, size / 21)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function drawIcon(ctx, size) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4285F4');
  gradient.addColorStop(1, '#9C27B0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Form shape
  const formWidth = size * 0.6;
  const formHeight = size * 0.7;
  const formX = (size - formWidth) / 2;
  const formY = (size - formHeight) / 2;
  
  // Form background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(formX, formY, formWidth, formHeight);
  
  // Form lines
  ctx.strokeStyle = 'rgba(66, 133, 244, 0.3)';
  ctx.lineWidth = Math.max(1, size / 64);
  const lineSpacing = formHeight / 5;
  for (let i = 1; i < 4; i++) {
    const y = formY + lineSpacing * i;
    ctx.beginPath();
    ctx.moveTo(formX + formWidth * 0.2, y);
    ctx.lineTo(formX + formWidth * 0.8, y);
    ctx.stroke();
  }
  
  // Checkmark
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = Math.max(3, size / 21);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const checkSize = size * 0.25;
  const checkX = formX + formWidth * 0.75;
  const checkY = formY + formHeight * 0.3;
  
  ctx.beginPath();
  ctx.moveTo(checkX - checkSize * 0.3, checkY);
  ctx.lineTo(checkX - checkSize * 0.1, checkY + checkSize * 0.3);
  ctx.lineTo(checkX + checkSize * 0.3, checkY - checkSize * 0.2);
  ctx.stroke();
}

// Run
generateIcons().catch(console.error);

