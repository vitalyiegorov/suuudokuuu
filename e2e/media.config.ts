import { runOptions, target } from './support/suuudokuuu/target.ts';

import type { E2EConfig } from 'e2e';

export default {
    ...runOptions,
    tests: 'media/**/*.e2e.ts',
    targets: [
        target('ios', process.env.SCREENSHOT_DEVICE ?? 'iPhone 17 Pro Max', { iosScreenshotBackend: 'runner' }, false),
        target('android', process.env.SCREENSHOT_DEVICE ?? 'Pixel 6', { osVersion: '35', imageTag: 'google_apis' }, false)
    ],
    video: 'off'
} satisfies E2EConfig;
