#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');
const folders = ['about', 'faq', 'dashboard', 'blog', 'transparency', 'contact'];

folders.forEach(folder => {
  const folderPath = path.join(appDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created: ${folderPath}`);
  }
});

console.log('All folders ready for page creation');
