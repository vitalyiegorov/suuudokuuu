module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.spec.util.ts', '!src/index.ts'],
    displayName: 'techniques',
    moduleNameMapper: {
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts'
    },
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 99,
            branches: 94,
            lines: 99,
            functions: 100
        }
    }
};
