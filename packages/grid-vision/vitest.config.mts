import { createVitestConfig } from '@suuudokuuu/test-kit/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(createVitestConfig(), {
    test: {
        include: ['test/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text-summary', 'lcov'],
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/constants/digit-classifier-weights.constant.ts']
        }
    }
});
