import { defineConfig, devices } from '@playwright/test';

import { isDefined } from '@rnw-community/shared';

import { landingOutDirectory, webAppDistDirectory } from './src/constants/served-build-directories.constant';

const { CI } = process.env;
const isCi = isDefined(CI);
const webServerPort = 4173;
const landingServerPort = 4174;

export default defineConfig({
    globalSetup: './global-setup.ts',
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
            testIgnore: /landing\//u,
            use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${webServerPort}` }
        },
        {
            name: 'mobile-chromium',
            testDir: './specs',
            testIgnore: /landing\//u,
            use: { ...devices['Pixel 7'], baseURL: `http://127.0.0.1:${webServerPort}` }
        },
        {
            name: 'mobile-webkit',
            testDir: './specs',
            testMatch: /(10\.localized-quit-game|11\.backdrop-recomposite)\.spec\.ts/u,
            use: { ...devices['iPhone 14'], baseURL: `http://127.0.0.1:${webServerPort}` }
        },
        {
            name: 'landing-chromium',
            testDir: './specs/landing',
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
