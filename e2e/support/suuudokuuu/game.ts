import { setTimeout as sleep } from 'node:timers/promises';

import { expect } from 'e2e';

import {
    backgroundFor,
    expectId,
    goHome,
    expectText,
    expectNoId,
    openLink,
    scrollDown,
    scrollToId,
    seconds,
    tapId,
    WAIT_SLOW,
    type Ctx
} from './core.ts';

const TIMER_OBSERVATION = 2_500;

const OK = /^(OK|Гаразд|حسنًا|ঠিক আছে|ठीक है|ٹھیک ہے|确定)$/u;

async function retryOnce(body: () => Promise<void>): Promise<void> {
    try {
        await body();
    } catch {
        await body();
    }
}

export async function startNewGame(ctx: Ctx): Promise<void> {
    await scrollToId(ctx, 'HomeScreenSelectors.StartButton');
    await scrollDown(ctx);
    await tapId(ctx, 'HomeScreenSelectors.StartButton');
    await expectId(ctx, 'GameScreenSelectors.Root', WAIT_SLOW);
    await expectNoId(ctx, 'HomeScreenSelectors.Root');
    await expect(ctx.screen.getByTestId(/^CellSelectors\.Cell\./u).first()).toBeVisible();
    await expect(ctx.screen.getByTestId(/^AvailableValueItemSelectors\.Button\./u).first()).toBeVisible();
}

export async function quitCurrentGame(ctx: Ctx): Promise<void> {
    const ok = ctx.screen.getByRole('button', { name: OK }).last();
    await tapId(ctx, 'GameScreenSelectors.QuitButton');
    await expect(ok).toBeVisible();
    await retryOnce(async () => {
        await ok.tap();
        await expectId(ctx, 'HomeScreenSelectors.Root');
    });
}

export async function openSettingsFromGame(ctx: Ctx): Promise<void> {
    await tapId(ctx, 'GameScreenSelectors.SettingsButton');
    await expectId(ctx, 'SettingsScreenSelectors.Root');
}

export async function pauseCurrentGame(ctx: Ctx): Promise<void> {
    await backgroundFor(ctx, 1_000);
    await expectId(ctx, 'PauseScreenSelectors.Root');
}

export async function assertTimerAdvances(ctx: Ctx): Promise<void> {
    const baseline = await seconds(ctx, 'GameScreenSelectors.Time');
    await sleep(TIMER_OBSERVATION);
    expect(await seconds(ctx, 'GameScreenSelectors.Time')).toBeGreaterThan(baseline);
}

export async function enableChallengeMode(ctx: Ctx): Promise<void> {
    await scrollToId(ctx, 'ChallengeModeSwitchSelectors.Root');
    await tapId(ctx, 'ChallengeModeSwitchSelectors.Root');
    await scrollToId(ctx, 'ChallengeConditionsRowSelectors.Root');
}

export async function relaunchHome(ctx: Ctx): Promise<void> {
    await retryOnce(async () => {
        await ctx.app.restart();
        await tapId(ctx, 'MainTabSelectors.Play');
        await expectId(ctx, 'HomeScreenSelectors.Root', WAIT_SLOW);
    });
}

async function openScreen(ctx: Ctx, url: string, rootId: string): Promise<void> {
    await openLink(ctx, url);
    await expectId(ctx, rootId);
}

export const openDaily = (ctx: Ctx) => openScreen(ctx, 'suuudokuuu://daily', 'DailyStreakPillSelectors.Root');

export const openHistory = (ctx: Ctx) => openScreen(ctx, 'suuudokuuu://history', 'HistoryScreenSelectors.Root');

export const openSettings = (ctx: Ctx) => openScreen(ctx, 'suuudokuuu://settings', 'SettingsScreenSelectors.Root');

export async function openSharedChallenge(ctx: Ctx, link: string): Promise<void> {
    await retryOnce(() => openScreen(ctx, link, 'ChallengeAcceptScreenSelectors.AcceptButton'));
}

export async function acceptSharedChallenge(ctx: Ctx): Promise<void> {
    await tapId(ctx, 'ChallengeAcceptScreenSelectors.AcceptButton');
    await expectId(ctx, 'GameScreenSelectors.Root');
}

export async function completeWinningSharedChallenge(ctx: Ctx, link: string): Promise<void> {
    await openSharedChallenge(ctx, link);
    await expectText(ctx, 'Their time to beat');
    await acceptSharedChallenge(ctx);
    await tapId(ctx, 'CellSelectors.Cell.6-0');
    await tapId(ctx, 'AvailableValueItemSelectors.Button.2');
    await expectId(ctx, 'ChallengeResultScreenSelectors.OutcomeValue', WAIT_SLOW);
}

export async function openSharedHandoff(ctx: Ctx, link: string): Promise<void> {
    await retryOnce(() => openScreen(ctx, link, 'SharedScreenSelectors.Root'));
    await tapId(ctx, 'SharedScreenSelectors.ConfirmButton');
    await expectId(ctx, 'GameScreenSelectors.Root');
}

export async function openNewbieHistory(ctx: Ctx): Promise<void> {
    await ctx.screen.scrollUntilVisible(ctx.screen.getByText(/games? played/iu).first(), { direction: 'down', timeout: 20_000 });
    await scrollDown(ctx);
    await tapId(ctx, 'HistoryDifficultySelectors.Card.Newbie');
}

export async function runOutOfMistakes(ctx: Ctx): Promise<void> {
    await tapId(ctx, 'CellSelectors.Cell.0-4');
    await tapId(ctx, 'AvailableValueItemSelectors.Button.4');
    await expectText(ctx, '1/3');
    await tapId(ctx, 'AvailableValueItemSelectors.Button.4');
    await expectText(ctx, '2/3');
    await tapId(ctx, 'AvailableValueItemSelectors.Button.4');
    await expectId(ctx, 'ChallengeResultScreenSelectors.OutcomeValue');
}

export async function leaveReplayForHome(ctx: Ctx): Promise<void> {
    await tapId(ctx, 'ReplayActionsSelectors.BackButton');
    await expectId(ctx, 'HistoryGamesScreenSelectors.Root');
    await tapId(ctx, 'HeaderBackButtonSelectors.Root');
    await expectId(ctx, 'HistoryScreenSelectors.Root');
    await goHome(ctx);
}
