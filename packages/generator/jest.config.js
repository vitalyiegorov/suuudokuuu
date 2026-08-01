module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/index.ts'],
    displayName: 'generator',
    moduleNameMapper: {
        '^@suuudokuuu/solver-core$': '<rootDir>/../solver-core/src/index.ts',
        '^@suuudokuuu/solver-bitmask$': '<rootDir>/../solver-bitmask/src/index.ts'
    },
    testRegex: './src/.*\\.spec\\.(tsx?)$',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            statements: 99,
            branches: 97,
            lines: 99,
            functions: 100
        }
    }
};
