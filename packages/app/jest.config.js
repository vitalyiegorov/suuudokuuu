const path = require('node:path');

const reactNativeRoot = path.dirname(require.resolve('react-native'));

module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts', 'i18n-plural-rules.polyfill.ts', 'theme.enum.ts'],
    displayName: 'app',
    haste: {
        defaultPlatform: 'ios',
        platforms: ['android', 'ios', 'native']
    },
    resolver: require.resolve('@react-native/jest-preset/jest/resolver.js'),
    moduleNameMapper: {
        '^@suuudokuuu/encoder$': '<rootDir>/../encoder/src/index.ts',
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts',
        '^@suuudokuuu/solver$': '<rootDir>/../solver/src/index.ts',
        '^react-native($|/.*)': `${reactNativeRoot}/$1`
    },
    testRegex: './(?:src|vercel-functions)/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 90,
            lines: 100,
            functions: 100
        }
    },
    globals: { __DEV__: true },
    setupFiles: ['@react-native/jest-preset/jest/setup.js', '<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
        '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve('@react-native/jest-preset/jest/assetFileTransformer.js')
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors|@formatjs|@lingui|@messageformat|expo-localization|react-native|@react-native|@testing-library/react-native|test-renderer|@suuudokuuu/ui)/)'
    ]
};
