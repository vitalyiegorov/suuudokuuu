module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    displayName: 'encoder',
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 70,
            lines: 80,
            functions: 75
        }
    },
    transformIgnorePatterns: ['node_modules/(?!(@thi.ng/bitstream|@thi.ng/errors)/)']
};
