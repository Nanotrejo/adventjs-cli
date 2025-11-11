const fs = require('fs');
const path = require('path');

// Function to copy files recursively
const copyRecursive = (srcDir, destDir, isDev = false) => {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdirSync(srcDir, { withFileTypes: true }).forEach((file) => {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      copyRecursive(srcPath, destPath, isDev);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Always copy templates
const templatesSrcDir = path.join(__dirname, '../src/templates');
const templatesDestDir = path.join(__dirname, '../dist/templates');
copyRecursive(templatesSrcDir, templatesDestDir);
console.log('✓ Templates files copied successfully');

// Copy Example files only in DEV mode
const isDev = process.env.DEV === 'true' || process.argv.includes('--dev');
if (isDev) {
  const examplesSrcDir = path.join(__dirname, '../src/examples');
  const examplesDestDir = path.join(__dirname, '../dist/examples');
  copyRecursive(examplesSrcDir, examplesDestDir, true);
  console.log('[DEV] ✓ Example files copied successfully');
}
