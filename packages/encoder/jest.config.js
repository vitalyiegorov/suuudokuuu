module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/index.ts'],
    displayName: 'encoder',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 99,
            branches: 99,
            lines: 99,
            functions: 100
        }
    },
    transformIgnorePatterns: ['node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors)/)']
};
