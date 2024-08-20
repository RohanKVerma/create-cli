 const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');
 
function displayHelp() {
  console.log(`
Description:
 
Script to bundle/concat multiple files into a single file.
 
Usage:
 
bundle <[list of source JavaScript files]>
 
Options:
 
--minify    : Minimize the code by removing unnecessary spaces and characters.
--out <path>: Specify the path for the output file.
  `);
}
 
// Function to bundle files
function bundle(files, outputPath, minify = false) {
  let bundledFile = '';
 
  // Ensure the output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
 
  // Read and concatenate all files
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    bundledFile += content + '\n';
  });
 
  // Minify if minify arg is true
  if (minify) {
    const minifyResult = uglify.minify(bundledFile);
    if (minifyResult.error) {
      console.error('Error during minification:', minifyResult.error);
      return;
    }
    bundledFile = minifyResult.code;
  }
 
  // Write bundled content to the output file
  fs.writeFileSync(outputPath, bundledFile, 'utf-8');
  console.log(`Bundled file written to ${outputPath}`);
}
 
// Parse command line arguments
const args = process.argv.slice(2);
 
if (args.length === 0 || args.includes('--help')) {
  displayHelp();
} else {
  let minify = false;
  let outputPath = './dist/bundle.js';
  const files = [];
 
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--minify') {
      minify = true;
    } else if (args[i] === '--out') {
      outputPath = args[i + 1];
      i++;
    } else {
      files.push(args[i]);
    }
  }

  if (files.length === 0) {
    console.log('Error: No source files provided.');
    displayHelp();
  } else {
    bundle(files, outputPath, minify);
  }
}