module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'ui',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            lines: 100,
            functions: 100
        }
    }
};
