import { createVitestConfig } from '@suuudokuuu/test-kit/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(createVitestConfig(), { test: { include: ['scripts/seed-flow-state.test.ts'] } });
