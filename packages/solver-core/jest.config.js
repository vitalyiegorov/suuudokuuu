module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/index.ts'],
    displayName: 'solver-core',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node'
};
