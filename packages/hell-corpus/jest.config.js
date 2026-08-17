module.exports = {
    coverageReporters: ['text-summary', 'lcov'],
    reporters: ['default'],
    coveragePathIgnorePatterns: [
        '.mock.ts',
        'src/constants/hell-corpus-data.constant.ts',
        'src/constants/infinity-corpus-data.constant.ts'
    ],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/index.ts'],
    displayName: 'hell-corpus',
    moduleNameMapper: {
        '^@suuudokuuu/solver-core$': '<rootDir>/../solver-core/src/index.ts',
        '^@suuudokuuu/solver-bitmask$': '<rootDir>/../solver-bitmask/src/index.ts',
        '^@suuudokuuu/solver-dlx$': '<rootDir>/../solver-dlx/src/index.ts',
        '^@suuudokuuu/rating$': '<rootDir>/../rating/src/index.ts'
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
