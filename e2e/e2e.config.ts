import { randomBytes } from 'node:crypto';

import { mobile } from '@e2e-dev/mobile';

import { E2E_DROP_APP } from './support/simlock/exec.ts';
import { simlockDevices } from './support/simlock/provider.ts';

import type { E2EConfig } from 'e2e';

const env = (name: string): string => {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(`${name} is required`);
    }

    return value;
};

process.env.E2E_SESSION ??= `e2e-ios-${randomBytes(4).toString('hex')}`;

export default {
    projectId: 'suuudokuuu',
    targets: [
        {
            name: 'ios',
            engine: mobile({
                platform: 'ios',
                session: process.env.E2E_SESSION,
                settle: Number(process.env.E2E_SETTLE ?? 400),
                transition: Number(process.env.E2E_TRANSITION ?? 800),
                device: simlockDevices({
                    url: env('SIMLOCK_URL'),
                    token: env('SIMLOCK_TOKEN'),
                    device: process.env.SIMLOCK_DEVICE ?? 'iPhone 17 Pro',
                    extraApps: [E2E_DROP_APP]
                })
            }),
            app: {
                bundleId: process.env.E2E_APP_ID ?? 'com.vitalyiegorov.suuudokuuu.e2e',
                appPath: process.env.E2E_APP_PATH ?? env('SUUUDOKUUU_APP_PATH')
            }
        }
    ],
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
