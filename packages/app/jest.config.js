module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'app',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 90,
            lines: 100,
            functions: 100
        }
    },
    transformIgnorePatterns: ['node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors)/)'],
    moduleNameMapper: {
        '^@suuudokuuu/encoder$': '<rootDir>/../encoder/src',
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src'
    }
};
