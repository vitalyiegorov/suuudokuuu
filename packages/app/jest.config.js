module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts', 'i18n-plural-rules.polyfill.ts', 'theme.enum.ts'],
    displayName: 'app',
    moduleNameMapper: {
        '^@suuudokuuu/encoder$': '<rootDir>/../encoder/src/index.ts',
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts',
        '^@suuudokuuu/solver$': '<rootDir>/../solver/src/index.ts'
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
    setupFiles: ['<rootDir>/jest.setup.ts'],
    transform: { '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest' },
    transformIgnorePatterns: [
        'node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors|@formatjs|@lingui|@messageformat|expo-localization|@suuudokuuu/ui)/)'
    ]
};
