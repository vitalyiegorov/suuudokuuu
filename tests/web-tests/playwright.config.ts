import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig, devices } from '@playwright/test';

import { isDefined } from '@rnw-community/shared';

const { CI } = process.env;
const isCi = isDefined(CI);
const webServerPort = 4173;
const webAppDistDirectory = join(__dirname, '..', '..', 'packages', 'app', 'dist');
const webAppDistEntryPoint = join(webAppDistDirectory, 'index.html');

if (!existsSync(webAppDistEntryPoint)) {
    throw new Error(
        `Missing ${webAppDistEntryPoint}. Run "yarn workspace @suuudokuuu/app export:web" (or "yarn expo export --platform=web" inside packages/app) before running the web E2E suite.`
    );
}

export default defineConfig({
    testDir: './specs',
    fullyParallel: true,
    forbidOnly: isCi,
    retries: isCi ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }], ...(isCi ? [['github'] as const] : [])],
    use: {
        baseURL: `http://127.0.0.1:${webServerPort}`,
        locale: 'en-US',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'mobile-chromium',
            use: { ...devices['Pixel 7'] }
        }
    ],
    webServer: {
        command: `npx serve --single --listen ${webServerPort} ${webAppDistDirectory}`,
        port: webServerPort,
        reuseExistingServer: !isCi
    }
});
