import { randomBytes } from 'node:crypto';

import { mobile } from '@e2e-dev/mobile';
import { simlockDevices } from '@mobile-ci/e2e-simlock';
import { E2E_DROP_APP } from '@mobile-ci/e2e-simlock/exec';

import { BUNDLE_IDS } from './support/suuudokuuu/core.ts';

import type { E2EConfig } from 'e2e';

const env = (name: string): string => {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(`${name} is required`);
    }

    return value;
};

process.env.E2E_SESSION ??= `e2e-${randomBytes(4).toString('hex')}`;

const target = (platform: keyof typeof BUNDLE_IDS, device: string, extraApps: readonly string[]) => ({
    name: platform,
    engine: mobile({
        platform,
        session: process.env.E2E_SESSION,
        settle: Number(process.env.E2E_SETTLE ?? 400),
        transition: Number(process.env.E2E_TRANSITION ?? 800),
        device: simlockDevices({
            url: env('SIMLOCK_URL'),
            token: env('SIMLOCK_TOKEN'),
            platform,
            device: process.env.SIMLOCK_DEVICE ?? device,
            tenant: 'suuudokuuu',
            extraApps
        })
    }),
    app: {
        bundleId: process.env.E2E_APP_ID ?? BUNDLE_IDS[platform],
        appPath: env('E2E_APP_PATH')
    }
});

export default {
    projectId: 'suuudokuuu',
    targets: [target('ios', 'iPhone 17 Pro', [E2E_DROP_APP]), target('android', 'Pixel 6', [])],
    workers: Number(process.env.E2E_WORKERS ?? 1),
    timeout: 600_000,
    actionTimeout: 30_000,
    assertionTimeout: 10_000,
    launchTimeout: 90_000,
    cleanupTimeout: 60_000,
    retries: Number(process.env.E2E_RETRIES ?? 0),
    reporters: ['list', 'junit', 'markdown'],
    trace: 'retain-on-failure',
    video: process.env.E2E_VIDEO === 'on' || process.env.E2E_VIDEO === 'retain-on-failure' ? process.env.E2E_VIDEO : 'off',
    cache: 'off'
} satisfies E2EConfig;
