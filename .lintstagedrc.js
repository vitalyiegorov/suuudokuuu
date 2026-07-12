const path = require('node:path');

const quoteFileNames = fileNames => fileNames.map(fileName => JSON.stringify(fileName)).join(' ');

const formatJsonFiles = fileNames => {
    const jsonFileNames = fileNames.filter(fileName => path.basename(fileName) !== 'package.json');

    return jsonFileNames.length > 0 ? [`yarn prettier --write ${quoteFileNames(jsonFileNames)}`] : [];
};

module.exports = {
    '*.{ts,tsx}': ['yarn eslint --fix', 'yarn prettier --write'],
    '*.{js,mjs,cjs,md,yml,yaml}': ['yarn prettier --write'],
    '*.json': formatJsonFiles,
    'package.json': ['yarn prettier --write', 'yarn sort-package-json']
};
