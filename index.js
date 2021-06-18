const yaml = require('js-yaml');
const fs = require('fs');

const { writeToFile } = require('./helpers');
const { setupGap, setupFonts, setupColors } = require('./tasks');

const readStream = fs.createReadStream('./config.yml');

let config = '';
readStream.on('data', (chunk) => {
  config += chunk;
});

readStream.on('end', () => {
  const { config: configObject } = yaml.load(config);

  const [gapConfigWriteStream, gapModuleWriteableStreamData] = setupGap(configObject.gap);
  debugger;
  writeToFile(gapConfigWriteStream, gapModuleWriteableStreamData);

  const [fontsConfigWriteStream, fontsModuleWriteableStreamData] = setupFonts(configObject.fonts);
  writeToFile(fontsConfigWriteStream, fontsModuleWriteableStreamData);

  const [colorsConfigWriteStream, colorsModuleWriteableStreamData] = setupColors(configObject.colors);
  writeToFile(colorsConfigWriteStream, colorsModuleWriteableStreamData);
});