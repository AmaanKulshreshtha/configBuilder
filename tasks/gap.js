const { createConfigFile, getModuleExportString } = require('../helpers');

function setupGap(gapConfig) {
  const GAP = 'gap';
  const gapConfigWriteStream = createConfigFile(GAP);
  
  const createGapVariationObject = (type, measurementsConfig) => {
    const { regular, difference, variations } = measurementsConfig;
    const regexToMatch = new RegExp(type, 'ig');
    return variations
      .filter(variant => variant.match(regexToMatch))
      .reduce((acc, variant) => {
        const differenceMultiplier = variant.split('x').length;
        const delta = difference * differenceMultiplier;
        const variantValue = regular + ((type === 'small' ? -1 : 1) * delta);
        if (variantValue > 0) {
          acc[variant] = variantValue;
        }
        return acc;
      }, {});
  }
  
  const createGapExportingObject = (gapConfig) => {
    const largeVariationObject = createGapVariationObject('large', gapConfig)
    const smallVariationObject = createGapVariationObject('small', gapConfig)
    
    return {
      regular: gapConfig.regular,
      ...largeVariationObject,
      ...smallVariationObject
    }
  }
  
  const getGapModuleWriteableStreamData = () => {
    const gapConfigObject = createGapExportingObject(gapConfig);
    const gapConfigWritingStreamData = getModuleExportString`${GAP}${gapConfigObject}`;
  
    return gapConfigWritingStreamData;
  }

  return [gapConfigWriteStream, getGapModuleWriteableStreamData()];
}

module.exports = setupGap;