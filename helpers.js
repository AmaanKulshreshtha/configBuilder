const fs = require('fs');
const util = require('util');
const path = require('path');

const FOLDER_TO_BE_USED = 'config';
const EXT_TO_BE_USED = '.js';
const pathToCreate = path.resolve(__dirname, FOLDER_TO_BE_USED);

const createConfigFile = (type) => {
  const stats = fs.statSync(pathToCreate);
  if (!stats.isDirectory()) fs.mkdirSync(pathToCreate);

  return fs.createWriteStream(path.resolve(pathToCreate, `${type}${EXT_TO_BE_USED}`));
}

const getModuleExportString = (_, variableName, exportingObject) => {
  const cleanExportingObject = util.inspect(exportingObject, { depth: 5 });
  const moduleExportingString =
`const ${variableName} = ${cleanExportingObject};

export default ${variableName};
`;
  return moduleExportingString;
}

const simpleFileSetup = (property, config) => {
    const propertyConfigWriteStream = createConfigFile(property);

    const createPropertyExportingObject = (config) => Object.assign({}, config);

    const getPropertyModuleWriteableStreamData = () => {
      const propertyConfigObject = createPropertyExportingObject(config);
      const propertyConfigWritingStreamData = getModuleExportString`${property}${propertyConfigObject}`;
      return propertyConfigWritingStreamData;
    }

    return [propertyConfigWriteStream, getPropertyModuleWriteableStreamData()];
}

const writeToFile = (writeableStream, data) => writeableStream.write(data, 'utf8');

module.exports = {
  createConfigFile,
  getModuleExportString,
  writeToFile,
  simpleFileSetup
}