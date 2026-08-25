module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: ['.mock.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/index.ts', '!src/react/**'],
    displayName: 'field-core',
    moduleNameMapper: {
        '^@suuudokuuu/generator$': '<rootDir>/../generator/src/index.ts',
        '^@suuudokuuu/techniques$': '<rootDir>/../techniques/src/index.ts',
        '^@suuudokuuu/solver-core$': '<rootDir>/../solver-core/src/index.ts',
        '^@suuudokuuu/solver-bitmask$': '<rootDir>/../solver-bitmask/src/index.ts'
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
