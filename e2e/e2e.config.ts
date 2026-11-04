import { runOptions, target } from './support/suuudokuuu/target.ts';

import type { E2EConfig } from 'e2e';

export default {
    ...runOptions,
    tests: 'tests/**/*.e2e.ts',
    targets: [target('ios', 'iPhone 17 Pro'), target('android', 'Pixel 6')],
    video: process.env.E2E_VIDEO === 'on' || process.env.E2E_VIDEO === 'retain-on-failure' ? process.env.E2E_VIDEO : 'off'
} satisfies E2EConfig;
