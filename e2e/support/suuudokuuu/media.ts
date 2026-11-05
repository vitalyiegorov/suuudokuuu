import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

import { test as base } from '@e2e-dev/mobile';
import { exec, mustExec } from '@mobile-ci/e2e-simlock/exec';

import {
    AllScenes,
    DefaultSeedDifficulty,
    localeIdentifierFor,
    sceneScreenshotBaseName
} from '../../../tests/app-tests/scripts/screenshot-scenes.ts';
import { persistRootDatabase } from '../../../tests/app-tests/scripts/seed-app-state.ts';

import { BUNDLE_IDS, backgroundFor, byText, expectId, openLink, Suuudokuuu, tapId, WAIT_SLOW, type Ctx } from './core.ts';
import { acceptSharedChallenge, openSharedChallenge, startNewGame } from './game.ts';

/** One capture: a scene in one locale and appearance, written to `path`. */
export interface Cell {
    readonly test: string;
    readonly locale: string;
    readonly appearance: string;
    readonly path: string;
}

interface Tap {
    readonly endSeconds: number;
    readonly xPoints: number;
    readonly yPoints: number;
}

/** A screen's entry fade outlasts its testIDs appearing: one second caught Android's result screen mid-fade. */
const SETTLE_MS = 6_000;

const WIN_CHALLENGE = 'suuudokuuu://shared/_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-';

/** Longer than the longest gap `compose-app-preview.ts` cuts to, so every cut has footage. */
const PREVIEW_HOLD_MS = 2_400;

/** The tutorial game the preview plays: the board cells and buttons it taps, in order. */
const PREVIEW_TAPS = [
    'CellSelectors.Cell.8-8',
    'AvailableValueItemSelectors.Button.2',
    'CellSelectors.Cell.8-4',
    'AvailableValueItemSelectors.Button.5',
    'InputModeButtonSelectors.Root',
    'CellSelectors.Cell.1-3',
    'CandidateInputItemSelectors.Button.3',
    'CandidateInputItemSelectors.Button.9',
    'CandidateInputItemSelectors.Button.9',
    'CandidateInputItemSelectors.Button.4',
    'CellSelectors.Cell.3-6',
    'CandidateInputItemSelectors.Button.1',
    'CandidateInputItemSelectors.Button.2',
    'InputModeButtonSelectors.Root',
    'HintButtonSelectors.Root',
    'HintPanelSelectors.NextButton',
    'HintPanelSelectors.NextButton',
    'HintPanelSelectors.NextButton',
    'HintPanelSelectors.ApplyButton',
    'CellSelectors.Cell.0-1',
    'AvailableValueItemSelectors.Button.4'
];

/** The status bar every capture shows. */
const IOS_STATUS_BAR = [
    'status_bar',
    'override',
    '--time',
    '9:41',
    '--dataNetwork',
    'wifi',
    '--wifiMode',
    'active',
    '--wifiBars',
    '3',
    '--batteryState',
    'charged',
    '--batteryLevel',
    '100'
];
const ANDROID_STATUS_BAR = [
    'settings put global sysui_demo_allowed 1',
    'am broadcast -a com.android.systemui.demo -e command enter',
    'am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0941',
    'am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false',
    'am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4 -e fully true',
    'am broadcast -a com.android.systemui.demo -e command network -e mobile hide',
    'am broadcast -a com.android.systemui.demo -e command notifications -e visible false'
].join(' && ');

type Scene = {
    readonly seed?: { readonly sceneState?: string; readonly difficulty?: string };
    readonly run: (media: Media, cell: Cell) => Promise<void>;
};

const deepLinkScene = (name: string, readyId: string): Scene => {
    const scene = AllScenes.find(candidate => candidate.name === name);
    if (scene?.deepLink === undefined) {
        throw new Error(`${name} is not a deep-link scene`);
    }
    const link = scene.deepLink;

    return {
        seed: { sceneState: scene.sceneState, difficulty: scene.seedDifficulty },
        run: async ({ ctx }) => {
            await openLink(ctx, link);
            await expectId(ctx, readyId, WAIT_SLOW);
        }
    };
};

/** What each `test` of the capture plan drives. Each scene ends on its screen, and `Media.capture` takes the still. */
const SCENES: Record<string, Scene> = {
    home: deepLinkScene('home', 'HomeScreenSelectors.Root'),
    'hero-board': deepLinkScene('hero-board', 'GameScreenSelectors.Root'),
    stats: deepLinkScene('stats', 'HistoryScreenSelectors.Root'),
    win: {
        run: async ({ ctx }) => {
            await openSharedChallenge(ctx, WIN_CHALLENGE);
            await acceptSharedChallenge(ctx);
            await tapId(ctx, 'CellSelectors.Cell.6-0');
            await tapId(ctx, 'AvailableValueItemSelectors.Button.2');
            await expectId(ctx, 'ChallengeResultScreenSelectors.OutcomeValue', WAIT_SLOW);
        }
    },
    pause: {
        run: async ({ ctx }) => {
            await startNewGame(ctx);
            await backgroundFor(ctx, 3_000);
            await expectId(ctx, 'PauseScreenSelectors.TimeValue');
        }
    },
    'app-preview': {
        seed: { sceneState: 'preview', difficulty: 'Medium' },
        run: async (media, cell) => {
            const { ctx } = media;
            await openLink(ctx, 'suuudokuuu://game');
            const resume = byText(ctx.screen, 'Continue');
            if (await resume.isVisible()) {
                await resume.tap();
            }
            await expectId(ctx, 'AvailableValueItemSelectors.Button.1');
            await media.recordPreview(cell);
        }
    }
};

const SCENE_NAMES = new Map(AllScenes.map(scene => [scene.name, sceneScreenshotBaseName(scene)]));

const list = (value: string | undefined, fallback: string): string[] =>
    (value ?? fallback)
        .split(',')
        .map(entry => entry.trim())
        .filter(entry => entry !== '');

function fail(message: string): never {
    throw new Error(`capture plan: ${message}`);
}

function parseCell(value: unknown, index: number): Cell {
    const cell = (typeof value === 'object' && value !== null ? value : fail(`cell ${index} is not an object`)) as Record<string, unknown>;
    const { test, locale, appearance, path } = cell;
    if (typeof test !== 'string' || !(test in SCENES)) {
        fail(`cell ${index} names no scene test: ${String(test)}`);
    }
    if (typeof locale !== 'string' || (appearance !== 'light' && appearance !== 'dark')) {
        fail(`cell ${index} (${test}) needs a locale and a light or dark appearance`);
    }
    if (typeof path !== 'string' || !isAbsolute(path) || !path.endsWith('.png')) {
        fail(`cell ${index} (${test}) path must be an absolute .png path`);
    }

    return { test, locale, appearance, path };
}

/** The directory the store compose script reads a platform's raw captures from, under `.e2e/media`. */
const rawDirectory = (platform: string, device: string): string[] =>
    platform === 'android' ? ['android'] : ['ios', device.startsWith('iPad') ? 'ipad' : 'iphone'];

/**
 * The cells this run captures. `SCREENSHOT_PLAN` is the JSON array mobile-ci's store-screenshots workflow writes.
 * Without it, every `SCREENSHOT_SCENES` × `SCREENSHOT_LOCALES` × `SCREENSHOT_APPEARANCES` for `SCREENSHOT_PLATFORM`,
 * under `.e2e/media/raw` at the layout `capture-store-screenshots.ts` writes.
 */
export function plan(env: NodeJS.ProcessEnv = process.env): readonly Cell[] {
    if (env.SCREENSHOT_PLAN !== undefined && env.SCREENSHOT_PLAN !== '') {
        const parsed: unknown = JSON.parse(readFileSync(env.SCREENSHOT_PLAN, 'utf8'));
        if (!Array.isArray(parsed) || parsed.length === 0) {
            fail(`${env.SCREENSHOT_PLAN} holds no cells`);
        }

        return parsed.map(parseCell);
    }
    const scenes = list(env.SCREENSHOT_SCENES, Object.keys(SCENES).join(','));
    const platform = env.SCREENSHOT_PLATFORM ?? 'ios';
    const root = resolve(join(import.meta.dirname, '../../.e2e/media/raw'), ...rawDirectory(platform, env.SCREENSHOT_DEVICE ?? ''));

    return scenes.flatMap(test =>
        list(env.SCREENSHOT_LOCALES, 'en').flatMap(locale =>
            list(env.SCREENSHOT_APPEARANCES, 'dark').map((appearance, index) =>
                parseCell({ test, locale, appearance, path: join(root, locale, appearance, `${SCENE_NAMES.get(test) ?? test}.png`) }, index)
            )
        )
    );
}

const prepared = new Set<string>();

/** One capture cell on the leased device: seeded from the screenshot fixture, driven to its screen, written pixel for pixel. */
export class Media extends Suuudokuuu {
    async capture(cell: Cell): Promise<void> {
        const scene = SCENES[cell.test];
        const lease = await this.lease();
        if (!prepared.has(lease)) {
            await this.start();
            await this.prepareDisplay(lease);
            prepared.add(lease);
        }
        await this.setLocale(lease, cell.locale);
        await this.start(
            undefined,
            persistRootDatabase({
                appearance: cell.appearance,
                difficulty: scene.seed?.difficulty ?? DefaultSeedDifficulty,
                language: cell.locale,
                sceneState: scene.seed?.sceneState
            })
        );
        await scene.run(this, cell);
        await sleep(SETTLE_MS);
        await this.screenshot(cell.path);
    }

    /** The device's own pixels, unmasked and unscaled. */
    async screenshot(path: string): Promise<void> {
        mkdirSync(dirname(path), { recursive: true });
        const shot = await this.ctx.device.unstable_raw.client.capture.screenshot({ path });
        if (shot.path !== path) {
            copyFileSync(shot.path, path);
        }
        console.log(`[capture] ${path} ${shot.width ?? '?'}x${shot.height ?? '?'}`);
    }

    /** `<scene>.mp4` and `<scene>.taps.json` beside the cell's PNG: what `compose-app-preview.ts` cuts the preview from. */
    async recordPreview(cell: Cell): Promise<void> {
        const taps: Tap[] = [];
        await this.ctx.app.startRecording({ name: 'app-preview' });
        await sleep(PREVIEW_HOLD_MS);
        for (const id of PREVIEW_TAPS) {
            taps.push(await this.tapAndHold(this.ctx, id));
        }
        const [video] = await this.ctx.app.stopRecording();
        if (!('path' in video)) {
            throw new Error(`the preview recording is a link (${video.url}), not a file`);
        }
        mkdirSync(dirname(cell.path), { recursive: true });
        copyFileSync(video.path, cell.path.replace(/\.png$/u, '.mp4'));
        writeFileSync(cell.path.replace(/\.png$/u, '.taps.json'), JSON.stringify(taps));
    }

    private async tapAndHold(ctx: Ctx, id: string): Promise<Tap> {
        const target = ctx.screen.getByTestId(id).first();
        const box = await target.boundingBox();
        if (box === null) {
            throw new Error(`${id} has no box`);
        }
        await target.tap();
        const endSeconds = Date.now() / 1_000;
        await sleep(PREVIEW_HOLD_MS);

        return { endSeconds, xPoints: box.x + box.width / 2, yPoints: box.y + box.height / 2 };
    }

    private async prepareDisplay(lease: string): Promise<void> {
        if (this.ctx.device.unstable_raw.platform === 'android') {
            // The 1080x1920 Play composition's source size.
            await mustExec(this.api, lease, ['shell', 'wm size 1080x2340 && wm density 440']);
        }
        if (process.env.SCREENSHOT_STATUS_BAR === 'real') {
            return;
        }
        await (this.ctx.device.unstable_raw.platform === 'android'
            ? mustExec(this.api, lease, ['shell', ANDROID_STATUS_BAR])
            : mustExec(this.api, lease, IOS_STATUS_BAR));
    }

    /** The app's language is its seeded setting; this aligns what the OS draws around it. */
    private async setLocale(lease: string, locale: string): Promise<void> {
        const appId = process.env.E2E_APP_ID ?? BUNDLE_IDS.android;
        if (this.ctx.device.unstable_raw.platform === 'android') {
            await exec(this.api, lease, ['shell', `cmd locale set-app-locales ${appId} --locales ${locale}`]);

            return;
        }
        await mustExec(this.api, lease, ['spawn', 'defaults', 'write', '.GlobalPreferences', 'AppleLanguages', '-array', locale]);
        await mustExec(this.api, lease, [
            'spawn',
            'defaults',
            'write',
            '.GlobalPreferences',
            'AppleLocale',
            '-string',
            localeIdentifierFor(locale)
        ]);
    }
}

const test = base.extend<{ media: Media }>({
    media: async ({ screen, app, device }, provide) => {
        await provide(new Media({ screen, app, device }));
    }
});

/** Files the cells are dealt over: e2e gives each file to one worker, so this is the most devices a run can use. */
const SHARDS = 4;

/** Declares this shard's tests: every `SHARDS`-th cell of the plan, from `shard`. */
export function captureShard(shard: number): void {
    plan().forEach((cell, index) => {
        if (index % SHARDS === shard) {
            test(`${cell.test} ${cell.locale} ${cell.appearance}`, async ({ media }) => {
                await media.capture(cell);
            });
        }
    });
}
