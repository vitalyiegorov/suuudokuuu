import { setTimeout as sleep } from 'node:timers/promises';

import { expect } from 'e2e';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

const SETTINGS_VISIT = 4_000;
const SETTINGS_BEFORE_STOP = 1_500;

async function settingsVisitKeepsTimerPaused(ctx: core.Ctx): Promise<number> {
    const paused = await core.seconds(ctx, 'GameScreenSelectors.Time');
    const startedAt = Date.now();
    await game.openSettingsFromGame(ctx);
    await sleep(SETTINGS_VISIT);
    await core.expectId(ctx, 'SettingsScreenSelectors.Root');
    await core.tapId(ctx, 'HeaderBackButtonSelectors.Root');
    await core.expectId(ctx, 'GameScreenSelectors.Root');
    const returned = await core.seconds(ctx, 'GameScreenSelectors.Time');
    expect((Date.now() - startedAt) / 1000 - (returned - paused)).toBeGreaterThanOrEqual(3);

    return returned;
}

test('06 resume game', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('start a game', () => game.startNewGame(ctx));

    const returned = await core.phase('settings visits pause the timer', async () => {
        await settingsVisitKeepsTimerPaused(ctx);
        await game.assertTimerAdvances(ctx);
        const second = await settingsVisitKeepsTimerPaused(ctx);
        await game.assertTimerAdvances(ctx);

        return second;
    });

    await core.phase('relaunch restores the game', async () => {
        await game.openSettingsFromGame(ctx);
        await sleep(SETTINGS_BEFORE_STOP);
        await game.relaunchHome(ctx);
        await core.scrollToId(ctx, 'HomeScreenSelectors.ResumeButton');
        await core.scrollDown(ctx);
        await core.tapId(ctx, 'HomeScreenSelectors.ResumeButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root', core.WAIT_LAUNCH);
        expect(await core.seconds(ctx, 'GameScreenSelectors.Time')).toBeGreaterThanOrEqual(returned);
        await game.assertTimerAdvances(ctx);
        await expect(ctx.screen.getByTestId(/^CellSelectors\.Cell\./u).first()).toBeVisible();
        await expect(ctx.screen.getByTestId(/^AvailableValueItemSelectors\.Button\./u).first()).toBeVisible();
        await game.quitCurrentGame(ctx);
    });
});
