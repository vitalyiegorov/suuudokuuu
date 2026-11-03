import { readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

import { expect } from 'e2e';

import { exec, leaseIdForUdid, mustDrop, mustExec, simlockApiFromEnv, writeFile, type SimlockApi } from '../simlock/exec.ts';

import type { Device } from '@e2e-dev/mobile';
import type { App, Locator, Screen } from 'e2e';

export const WAIT_QUICK = 3_000;
export const WAIT_DEFAULT = 10_000;
export const WAIT_SLOW = 15_000;
export const WAIT_LAUNCH = 30_000;

export const BUNDLE_ID = process.env.E2E_APP_ID ?? 'com.vitalyiegorov.suuudokuuu.e2e';

const DATABASES = new URL('../../../tests/app-tests/fixtures/databases/', import.meta.url);

export interface Ctx {
    readonly screen: Screen;
    readonly app: App;
    readonly device: Device;
}

export const byId = (screen: Screen, testId: string | RegExp): Locator => screen.getByTestId(testId).first();

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

export async function expectId(ctx: Ctx, testId: string | RegExp, timeout?: number): Promise<void> {
    await expect(byId(ctx.screen, testId)).toBeVisible(timeout === undefined ? undefined : { timeout });
}

export async function expectNoId(ctx: Ctx, testId: string | RegExp, timeout?: number): Promise<void> {
    await expect(byId(ctx.screen, testId)).toBeHidden(timeout === undefined ? undefined : { timeout });
}

export async function expectText(ctx: Ctx, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(byText(ctx.screen, text)).toBeVisible(timeout === undefined ? undefined : { timeout });
}

export async function expectIdText(ctx: Ctx, testId: string | RegExp, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(ctx.screen.getByTestId(testId).filter({ hasText: text }).first()).toBeVisible(
        timeout === undefined ? undefined : { timeout }
    );
}

export async function scrollTo(ctx: Ctx, target: Locator, direction: 'up' | 'down' = 'down'): Promise<void> {
    await ctx.screen.scrollUntilVisible(target, { direction, timeout: 20_000 });
}

export async function scrollToId(ctx: Ctx, testId: string | RegExp, direction: 'up' | 'down' = 'down'): Promise<void> {
    await scrollTo(ctx, byId(ctx.screen, testId), direction);
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

export async function seconds(ctx: Ctx, testId: string): Promise<number> {
    const [minutes = '', rest = ''] = ((await byId(ctx.screen, testId).textContent()) ?? '').split(':');
    const value = Number(minutes) * 60 + Number(rest);

    if (!Number.isFinite(value)) {
        throw new Error(`${testId} does not read as mm:ss`);
    }

    return value;
}

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
        if (!prepared.has(lease)) {
            await phase('prepare simulator', () => this.#prepare(lease));
            prepared.add(lease);
        }
        await phase('seed', () => this.#seed(lease, fixture));
        await phase('launch', async () => {
            await this.ctx.app.open();
            await expectId(this.ctx, 'MainTabSelectors.Play', WAIT_LAUNCH);
            await tapId(this.ctx, 'MainTabSelectors.Play');
            await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_SLOW);
        });
    }

    async #prepare(lease: string): Promise<void> {
        await mustExec(this.api, lease, ['spawn', 'defaults', 'write', '.GlobalPreferences', 'AppleLanguages', '-array', 'en-US']);
        await mustExec(this.api, lease, ['spawn', 'defaults', 'write', '.GlobalPreferences', 'AppleLocale', '-string', 'en_US']);
        await mustExec(this.api, lease, ['spawn', 'defaults', 'write', 'com.apple.Accessibility', 'ReduceMotionEnabled', '-bool', 'true']);
        await this.ctx.app.open();
        await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_LAUNCH);
        await openLink(this.ctx, 'suuudokuuu://');
        await sleep(1_000);
        await acceptOpenInPrompt(this.ctx);
        await expectId(this.ctx, 'HomeScreenSelectors.Root', WAIT_LAUNCH);
    }

    async #seed(lease: string, fixture?: string): Promise<void> {
        await exec(this.api, lease, ['terminate', BUNDLE_ID]);
        const container = (await mustExec(this.api, lease, ['get_app_container', BUNDLE_ID, 'data'])).trim();
        if (!container.startsWith('/')) {
            throw new Error(`unexpected app data container for ${BUNDLE_ID}: ${container}`);
        }
        await mustDrop(this.api, lease, ['rm', `${container}/Library`, 'suuudokuuu.db']);
        if (fixture !== undefined) {
            await writeFile(this.api, lease, `${container}/Library/suuudokuuu.db`, readFileSync(new URL(`${fixture}.db`, DATABASES)));
        }
    }
}

export async function expectNoIdText(ctx: Ctx, testId: string | RegExp, text: string | RegExp, timeout?: number): Promise<void> {
    await expect(ctx.screen.getByTestId(testId).filter({ hasText: text }).first()).toBeHidden(
        timeout === undefined ? undefined : { timeout }
    );
}
