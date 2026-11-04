import { runOptions, target } from './support/suuudokuuu/target.ts';

import type { E2EConfig } from 'e2e';

/**
 * The store media capture, its own config so the PR suite never collects it: `npx e2e run --config media.config.ts`.
 * Stills come from the XCTest runner, which draws no Dynamic Island. Android leases the API 35 `google_apis` image,
 * because the ATD image's screenshots are black and its recordings never finalize.
 */
export default {
    ...runOptions,
    tests: 'media/**/*.e2e.ts',
    targets: [
        target('ios', process.env.SCREENSHOT_DEVICE ?? 'iPhone 17 Pro Max', { iosScreenshotBackend: 'runner' }, false),
        target('android', process.env.SCREENSHOT_DEVICE ?? 'Pixel 6', { osVersion: '35', imageTag: 'google_apis' }, false)
    ],
    video: 'off'
} satisfies E2EConfig;
