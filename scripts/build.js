import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Create dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy HTML files
const htmlFiles = ['index.html', 'products.html', 'about.html', 'contact.html', 'checkout.html', 'returns.html', 'track-order.html', 'googleb3e8cd22f384e7cb.html'];
htmlFiles.forEach(file => {
  const src = path.join(projectRoot, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

// Copy Public folder
const publicSrc = path.join(projectRoot, 'Public');
const publicDest = path.join(distDir, 'Public');
if (fs.existsSync(publicSrc)) {
  copyDir(publicSrc, publicDest);
  console.log('✓ Copied Public folder');
}

// Copy src/styles folder
const stylesSrc = path.join(projectRoot, 'src', 'styles');
const stylesDest = path.join(distDir, 'src', 'styles');
if (fs.existsSync(stylesSrc)) {
  copyDir(stylesSrc, stylesDest);
  console.log('✓ Copied src/styles folder');
}

// Copy src/scripts folder
const scriptsSrc = path.join(projectRoot, 'src', 'scripts');
const scriptsDest = path.join(distDir, 'src', 'scripts');
if (fs.existsSync(scriptsSrc)) {
  copyDir(scriptsSrc, scriptsDest);
  console.log('✓ Copied src/scripts folder');
}

// Copy data folder
const dataSrc = path.join(projectRoot, 'data');
const dataDest = path.join(distDir, 'data');
if (fs.existsSync(dataSrc)) {
  copyDir(dataSrc, dataDest);
  console.log('✓ Copied data folder');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

console.log('\n✓ Build complete! Output in ./dist');
