const path = require('node:path');

const reactNativeRoot = path.dirname(require.resolve('react-native'));

module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    collectCoverageFrom: ['src/**/*.util.ts'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'ui',
    haste: {
        defaultPlatform: 'ios',
        platforms: ['android', 'ios', 'native']
    },
    resolver: require.resolve('@react-native/jest-preset/jest/resolver.js'),
    moduleNameMapper: {
        '^react-native($|/.*)': `${reactNativeRoot}/$1`
    },
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            lines: 100,
            functions: 100
        }
    },
    globals: { __DEV__: true },
    setupFiles: ['@react-native/jest-preset/jest/setup.js', 'react-native-unistyles/mocks', '<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
        '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve('@react-native/jest-preset/jest/assetFileTransformer.js')
    },
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|react-native-reanimated|react-native-worklets|@react-native|@testing-library/react-native|test-renderer)/)'
    ]
};
