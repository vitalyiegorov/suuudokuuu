import { setTimeout as sleep } from 'node:timers/promises';

import { expect } from 'e2e';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('07 background foreground game', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('start a game', async () => {
        await game.startNewGame(ctx);
        await game.assertTimerAdvances(ctx);
    });

    await core.phase('background pauses the timer', async () => {
        const before = await core.seconds(ctx, 'GameScreenSelectors.Time');
        const sampledAt = Date.now();
        await ctx.device.home();
        const backgroundedAt = Date.now();
        await sleep(core.WAIT_QUICK);
        await ctx.device.openApp(core.BUNDLE_ID);
        await core.expectId(ctx, 'PauseScreenSelectors.Root');
        await core.expectText(ctx, 'Paused');
        await core.expectNoId(ctx, 'GameScreenSelectors.Root');
        const paused = await core.seconds(ctx, 'PauseScreenSelectors.TimeValue');
        expect(paused).toBeLessThanOrEqual(before + Math.ceil((backgroundedAt - sampledAt) / 1000) + 1);
    });

    await core.phase('resume', async () => {
        await core.tapId(ctx, 'PauseScreenSelectors.ResumeButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.assertTimerAdvances(ctx);
        await game.quitCurrentGame(ctx);
    });
});
