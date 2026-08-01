const path = require('node:path');

const reactNativeRoot = path.dirname(require.resolve('react-native'));

module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.spec.{ts,tsx}', '!src/i18n/locales/**'],
    coveragePathIgnorePatterns: ['.mock.ts', 'i18n-plural-rules.polyfill.ts', 'theme.enum.ts'],
    displayName: 'app',
    haste: {
        defaultPlatform: 'ios',
        platforms: ['android', 'ios', 'native']
    },
    resolver: require.resolve('./jest.resolver.js'),
    moduleNameMapper: {
        '^@suuudokuuu/encoder$': '<rootDir>/../encoder/src/index.ts',
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts',
        '^@suuudokuuu/hell-corpus$': '<rootDir>/../hell-corpus/src/index.ts',
        '^@suuudokuuu/solver-core$': '<rootDir>/../solver-core/src/index.ts',
        '^@suuudokuuu/techniques$': '<rootDir>/../techniques/src/index.ts',
        '^@suuudokuuu/ui$': '<rootDir>/../ui/src/index.ts',
        '^@suuudokuuu/ui/theme$': '<rootDir>/../ui/src/theme/index.ts',
        '^@suuudokuuu/ui/app-button-get-colors$': '<rootDir>/../ui/src/components/app-button/utils/app-button-get-colors.util.ts',
        '^@suuudokuuu/ui/app-metric-strip-get-colors$':
            '<rootDir>/../ui/src/components/app-metric-strip/utils/app-metric-strip-get-colors.util.ts',
        '^@suuudokuuu/ui/app-toggle-get-colors$': '<rootDir>/../ui/src/components/app-toggle/utils/app-toggle-get-colors.util.ts',
        '^react-native-reanimated$': '<rootDir>/src/@generic/mocks/react-native-reanimated.mock.tsx',
        '^react-native($|/.*)': `${reactNativeRoot}/$1`,
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testRegex: './(?:src|vercel-functions)/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        'src/**/*.util.ts': {
            statements: 100,
            branches: 95,
            lines: 100,
            functions: 100
        },
        'src/**/store/*.ts': {
            statements: 100,
            branches: 95,
            lines: 100,
            functions: 100
        },
        global: {
            statements: 4,
            branches: 2,
            lines: 4,
            functions: 3
        }
    },
    globals: { __DEV__: true },
    setupFiles: [
        '@react-native/jest-preset/jest/setup.js',
        'react-native-unistyles/mocks',
        '<rootDir>/src/theme/unistyles.config.ts',
        '<rootDir>/jest.native-mocks.js',
        '<rootDir>/jest.setup.ts'
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
        '^.+\\.(bmp|gif|jpg|jpeg|mp4|png|psd|svg|webp)$': require.resolve('@react-native/jest-preset/jest/assetFileTransformer.js')
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors|@formatjs|@lingui|@messageformat|expo-localization|react-native|react-native-reanimated|react-native-worklets|@react-native|@testing-library/react-native|test-renderer|@suuudokuuu/ui)/)'
    ]
};
