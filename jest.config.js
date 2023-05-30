module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'custom-crawler-backend',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 71,
            branches: 56,
            lines: 68,
            functions: 70
        }
    }
};
