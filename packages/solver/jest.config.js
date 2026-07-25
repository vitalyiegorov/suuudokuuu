module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'solver',
    moduleNameMapper: {
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts'
    },
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 70,
            lines: 80,
            functions: 80
        }
    }
};
