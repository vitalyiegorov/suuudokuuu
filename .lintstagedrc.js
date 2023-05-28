module.exports = {
    '*.{ts,tsx}': ['yarn eslint --fix'],
    '*.{ts,tsx,md,json,js}': ['yarn prettier --write'],
    'package.json': ['yarn sort-package-json']
};
