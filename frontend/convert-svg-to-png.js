const svg2png = require('svg2png');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng(inputFile, outputFile, width, height) {
  try {
    const input = fs.readFileSync(path.resolve(__dirname, inputFile));
    const output = await svg2png(input, { width, height });
    fs.writeFileSync(path.resolve(__dirname, outputFile), output);
    console.log(`Converted ${inputFile} to ${outputFile}`);
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error);
  }
}

// Converter os arquivos SVG para PNG
async function convertAll() {
  await convertSvgToPng('public/logo192.svg', 'public/logo192.png', 192, 192);
  await convertSvgToPng('public/logo512.svg', 'public/logo512.png', 512, 512);
  console.log('Conversão concluída!');
}

convertAll();