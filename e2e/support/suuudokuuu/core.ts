import { readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

import { exec, leaseIdForUdid, mustDrop, mustExec, simlockApiFromEnv, writeFile, type SimlockApi } from '@mobile-ci/e2e-simlock/exec';
import { byId, scrollTo } from '@mobile-ci/e2e-simlock/steps';
import { expect } from 'e2e';

import type { Device } from '@e2e-dev/mobile';
import type { App, Locator, Screen } from 'e2e';

export const WAIT_QUICK = 3_000;
export const WAIT_DEFAULT = 10_000;
export const WAIT_SLOW = 15_000;
export const WAIT_LAUNCH = 30_000;

export const BUNDLE_IDS = { ios: 'com.vitalyiegorov.suuudokuuu.e2e', android: 'com.vitaliiyehorov.suuudokuuu.e2e' } as const;

type Platform = keyof typeof BUNDLE_IDS;

const bundleId = (platform: Platform): string => process.env.E2E_APP_ID ?? BUNDLE_IDS[platform];

const DATABASES = new URL('../../../tests/app-tests/fixtures/databases/', import.meta.url);

export interface Ctx {
    readonly screen: Screen;
    readonly app: App;
    readonly device: Device;
}

const exactly = (text: string | RegExp): RegExp =>
    typeof text === 'string' ? new RegExp(`^${text.replaceAll(/[.*+?^${}()|[\]\\]/gu, '\\$&')}$`, 'iu') : text;

export const byText = (screen: Screen, text: string | RegExp): Locator => screen.getByText(exactly(text)).first();

export async function phase<T>(name: string, body: () => Promise<T>): Promise<T> {
    const started = Date.now();
    try {
        return await body();
    } finally {
        console.log(`[phase] ${name} ${((Date.now() - started) / 1000).toFixed(1)}s`);
    }
}

export async function tapId(ctx: Ctx, testId: string): Promise<void> {
    await byId(ctx.screen, testId).tap();
}

export async function expectId(ctx: Ctx, testId: string, timeout?: number): Promise<void> {
    await expect(byId(ctx.screen, testId)).toBeVisible(timeout === undefined ? undefined : { timeout });
}

export async function expectNoId(ctx: Ctx, testId: string, timeout?: number): Promise<void> {
    await expect(byId(ctx.screen, testId)).toBeHidden(timeout === undefined ? undefined : { timeout });
}

export async function expectText(ctx: Ctx, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(byText(ctx.screen, text)).toBeVisible(timeout === undefined ? undefined : { timeout });
}

export async function expectIdText(ctx: Ctx, testId: string, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(ctx.screen.getByTestId(testId).filter({ hasText: text }).first()).toBeVisible(
        timeout === undefined ? undefined : { timeout }
    );
}

export async function scrollToId(ctx: Ctx, testId: string, direction: 'up' | 'down' = 'down'): Promise<void> {
    await scrollTo(ctx.screen, byId(ctx.screen, testId), direction);
}

export async function scrollDown(ctx: Ctx): Promise<void> {
    await ctx.screen.swipe({ direction: 'down' });
}

async function acceptOpenInPrompt({ screen }: Ctx): Promise<void> {
    const prompt = screen.getByText(/^Open in /u);
    if (await prompt.first().isVisible()) {
        await screen.getByText('Open').last().tap();
        await expect(prompt.first()).toBeHidden({ timeout: WAIT_QUICK });
    }
}

export async function openLink(ctx: Ctx, url: string): Promise<void> {
    await ctx.device.openLink(url);
    await sleep(500);
    await acceptOpenInPrompt(ctx);
}

export async function goHome(ctx: Ctx): Promise<void> {
    await openLink(ctx, 'suuudokuuu://');
    await expectId(ctx, 'HomeScreenSelectors.Root');
}

export async function backgroundFor(ctx: Ctx, milliseconds: number): Promise<number> {
    await ctx.device.home();
    const backgroundedAt = Date.now();
    await sleep(milliseconds);
    await ctx.device.openApp(bundleId(ctx.device.unstable_raw.platform));

    return backgroundedAt;
}

export async function seconds(ctx: Ctx, testId: string): Promise<number> {
    const [minutes = '', rest = ''] = ((await byId(ctx.screen, testId).textContent()) ?? '').split(':');
    const value = Number(minutes) * 60 + Number(rest);

    if (!Number.isFinite(value)) {
        throw new Error(`${testId} does not read as mm:ss`);
    }

    return value;
}

async function mustAdb(api: SimlockApi, lease: string, args: readonly string[], stdin?: string): Promise<void> {
    const response = await fetch(`${api.url.replace(/\/$/u, '')}/v1/leases/${lease}/exec`, {
        method: 'POST',
        headers: { authorization: `Bearer ${api.token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ tool: 'adb', args, ...(stdin === undefined ? {} : { stdin }) }),
        signal: AbortSignal.timeout(WAIT_LAUNCH * 4)
    });
    const events = (await response.text()).split('\n\n');
    const exit = events.find(event => event.startsWith('event: exit'));
    if (!response.ok || exit === undefined || !exit.includes('"exitCode":0')) {
        throw new Error(`adb ${args.join(' ')} failed (HTTP ${response.status}): ${events.join(' ').slice(0, 500)}`);
    }
}

interface DeviceState {
    readonly prepare: (api: SimlockApi, lease: string) => Promise<void>;
    readonly seed: (api: SimlockApi, lease: string, database?: Buffer) => Promise<void>;
}

const DEVICE_STATES: Record<Platform, DeviceState> = {
    ios: {
        prepare: async (api, lease) => {
            for (const setting of [
                ['.GlobalPreferences', 'AppleLanguages', '-array', 'en-US'],
                ['.GlobalPreferences', 'AppleLocale', '-string', 'en_US'],
                ['com.apple.Accessibility', 'ReduceMotionEnabled', '-bool', 'true']
            ]) {
                await mustExec(api, lease, ['spawn', 'defaults', 'write', ...setting]);
            }
        },
        seed: async (api, lease, database) => {
            await exec(api, lease, ['terminate', bundleId('ios')]);
            const container = (await mustExec(api, lease, ['get_app_container', bundleId('ios'), 'data'])).trim();
            if (!container.startsWith('/')) {
                throw new Error(`unexpected app data container for ${bundleId('ios')}: ${container}`);
            }
            await mustDrop(api, lease, ['rm', `${container}/Library`, 'suuudokuuu.db']);
            if (database !== undefined) {
                await writeFile(api, lease, `${container}/Library/suuudokuuu.db`, database);
            }
        }
    },
    android: {
        prepare: async (api, lease) => {
            await mustAdb(api, lease, ['root']);
        },
        seed: async (api, lease, database) => {
            const directory = `/data/data/${bundleId('android')}/databases`;
            const installed = `${directory}/suuudokuuu.db`;
            await mustAdb(api, lease, ['shell', `am force-stop ${bundleId('android')} && mkdir -p ${directory} && rm -f ${installed}*`]);
            if (database !== undefined) {
                await mustAdb(
                    api,
                    lease,
                    [
                        'shell',
                        `base64 -d > ${installed} && chown $(stat -c %u:%g /data/data/${bundleId('android')}) ${directory} ${installed} && restorecon ${directory} ${installed}`
                    ],
                    database.toString('base64')
                );
            }
        }
    }
};

const prepared = new Set<string>();

export class Suuudokuuu {
    readonly api: SimlockApi = simlockApiFromEnv();
    #lease?: string;

    constructor(readonly ctx: Ctx) {}

    async lease(): Promise<string> {
        this.#lease ??= await leaseIdForUdid(this.api, this.ctx.device.unstable_raw.deviceId);

        return this.#lease;
    }

    async start(fixture?: string): Promise<void> {
        const lease = await this.lease();
        const state = DEVICE_STATES[this.ctx.device.unstable_raw.platform];
        if (!prepared.has(lease)) {
            await phase('prepare device', () => this.#prepare(state, lease));
            prepared.add(lease);
        }
        await phase('seed', () =>
            state.seed(this.api, lease, fixture === undefined ? undefined : readFileSync(new URL(`${fixture}.db`, DATABASES)))
        );
        await phase('launch', async () => {
            await this.ctx.app.open();
            await expectId(this.ctx, 'MainTabSelectors.Play', WAIT_LAUNCH);
            await tapId(this.ctx, 'MainTabSelectors.Play');
            await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_SLOW);
        });
    }

    async #prepare(state: DeviceState, lease: string): Promise<void> {
        await state.prepare(this.api, lease);
        await this.ctx.app.open();
        await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_LAUNCH);
        await openLink(this.ctx, 'suuudokuuu://');
        await sleep(1_000);
        await acceptOpenInPrompt(this.ctx);
        await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_LAUNCH);
    }
}

export async function expectNoIdText(ctx: Ctx, testId: string, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(ctx.screen.getByTestId(testId).filter({ hasText: text }).first()).toBeHidden(
        timeout === undefined ? undefined : { timeout }
    );
}
