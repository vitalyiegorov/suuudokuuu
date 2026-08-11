import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { defineConfig, devices } from '@playwright/test';

import { isDefined } from '@rnw-community/shared';

const { CI } = process.env;
const isCi = isDefined(CI);
const webServerPort = 4173;
const landingServerPort = 4174;
const webAppDistDirectory = join(__dirname, '..', '..', 'packages', 'app', 'dist');
const webAppDistEntryPoint = join(webAppDistDirectory, 'index.html');
const landingOutDirectory = join(__dirname, '..', '..', 'packages', 'landing', 'out');
const landingOutEntryPoint = join(landingOutDirectory, 'index.html');

if (!existsSync(webAppDistEntryPoint)) {
    throw new Error(
        `Missing ${webAppDistEntryPoint}. Run "yarn workspace @suuudokuuu/app export:web" (or "yarn expo export --platform=web" inside packages/app) before running the web E2E suite.`
    );
}

if (!existsSync(landingOutEntryPoint)) {
    throw new Error(`Missing ${landingOutEntryPoint}. Run "yarn build --filter=@suuudokuuu/landing" before running the web E2E suite.`);
}

export default defineConfig({
    testDir: './specs',
    fullyParallel: true,
    forbidOnly: isCi,
    retries: isCi ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }], ...(isCi ? [['github'] as const] : [])],
    use: {
        locale: 'en-US',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            testDir: './specs',
            testIgnore: /techniques\//u,
            use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${webServerPort}` }
        },
        {
            name: 'mobile-chromium',
            testDir: './specs',
            testIgnore: /techniques\//u,
            use: { ...devices['Pixel 7'], baseURL: `http://127.0.0.1:${webServerPort}` }
        },
        {
            name: 'landing-chromium',
            testDir: './specs/techniques',
            use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${landingServerPort}` }
        }
    ],
    webServer: [
        {
            command: `npx serve --single --listen ${webServerPort} ${webAppDistDirectory}`,
            port: webServerPort,
            reuseExistingServer: !isCi
        },
        {
            command: `npx serve --listen ${landingServerPort} ${landingOutDirectory}`,
            port: landingServerPort,
            reuseExistingServer: !isCi
        }
    ]
});
