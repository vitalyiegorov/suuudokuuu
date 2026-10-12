import { defineConfig, devices } from '@playwright/test';

import { isDefined } from '@rnw-community/shared';

import { landingOutDirectory, webAppDistDirectory } from './src/constants/served-build-directories.constant';

const { CI } = process.env;
const isCi = isDefined(CI);
const defaultWebServerPort = 4173;
const defaultLandingServerPort = 4174;
const webServerPort = Number(process.env['WEB_E2E_PORT'] ?? defaultWebServerPort);
const landingServerPort = Number(process.env['LANDING_E2E_PORT'] ?? defaultLandingServerPort);

export default defineConfig({
    globalSetup: './global-setup.ts',
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
            testIgnore: /landing\//u,
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'mobile-chromium',
            testIgnore: /landing\//u,
            use: { ...devices['Pixel 7'] }
        },
        {
            name: 'mobile-webkit',
            testMatch: /(10\.localized-quit-game|11\.backdrop-recomposite)\.spec\.ts/u,
            use: { ...devices['iPhone 14'] }
        },
        {
            name: 'landing-chromium',
            testDir: './specs/landing',
            use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${landingServerPort}` }
        }
    ],
    webServer: [
        {
            command: `pnpm exec serve --single --listen ${webServerPort} ${webAppDistDirectory}`,
            port: webServerPort,
            reuseExistingServer: !isCi
        },
        {
            command: `pnpm exec serve --listen ${landingServerPort} ${landingOutDirectory}`,
            port: landingServerPort,
            reuseExistingServer: !isCi
        }
    ]
});
