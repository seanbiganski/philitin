#!/usr/bin/env node
// Script to package the Chrome extension for Chrome Web Store submission

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageDir = 'philitin-package';
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const version = manifest.version || '1.0.0';
const zipName = `philitin-v${version}.zip`;

// Files to include in the package
const filesToInclude = [
  'manifest.json',
  'background.js',
  'content.js',
  'data-generator.js',
  'popup.html',
  'popup.js',
  'popup.css',
  'icon16.png',
  'icon48.png',
  'icon128.png'
];

console.log('📦 Packaging Chrome extension for Chrome Web Store...\n');

// Clean up any existing package
if (fs.existsSync(packageDir)) {
  console.log('🧹 Cleaning up old package directory...');
  fs.rmSync(packageDir, { recursive: true, force: true });
}

// Create package directory
fs.mkdirSync(packageDir, { recursive: true });

// Copy files
console.log('📋 Copying extension files...');
let copiedCount = 0;
let missingCount = 0;

filesToInclude.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(packageDir, file));
    console.log(`  ✓ ${file}`);
    copiedCount++;
  } else {
    console.log(`  ✗ ${file} (missing!)`);
    missingCount++;
  }
});

if (missingCount > 0) {
  console.error(`\n❌ Error: ${missingCount} required file(s) are missing!`);
  process.exit(1);
}

// Create ZIP file
console.log(`\n📦 Creating ZIP file: ${zipName}...`);
try {
  // Remove old ZIP if it exists
  if (fs.existsSync(zipName)) {
    fs.unlinkSync(zipName);
  }

  // Create ZIP using zip command (available on macOS/Linux)
  execSync(`cd ${packageDir} && zip -r ../${zipName} .`, { stdio: 'inherit' });
  
  // Clean up package directory
  fs.rmSync(packageDir, { recursive: true, force: true });
  
  const stats = fs.statSync(zipName);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`\n✅ Package created successfully!`);
  console.log(`   File: ${zipName}`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log(`   Version: ${version}`);
  console.log(`\n📤 Ready to upload to Chrome Web Store!`);
  console.log(`   Go to: https://chrome.google.com/webstore/devconsole`);
  
} catch (error) {
  console.error('\n❌ Error creating ZIP file:', error.message);
  console.log('\n💡 Alternative: Manually zip the contents of the', packageDir, 'directory');
  process.exit(1);
}



