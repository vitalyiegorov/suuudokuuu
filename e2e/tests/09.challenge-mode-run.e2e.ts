import { expect } from 'e2e';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('09 challenge mode run', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('start a challenge run', async () => {
        await game.enableChallengeMode(ctx);
        await game.startNewGame(ctx);
        await core.expectNoId(ctx, 'GameScreenSelectors.PauseButton');
        await core.expectId(ctx, 'ChallengeRecordHudSelectors.Root');
    });

    await core.phase('clock runs in the background', async () => {
        const before = await core.seconds(ctx, 'GameScreenSelectors.Time');
        await core.backgroundFor(ctx, core.WAIT_QUICK);
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await core.expectNoId(ctx, 'PauseScreenSelectors.Root');
        expect(await core.seconds(ctx, 'GameScreenSelectors.Time')).toBeGreaterThan(before);
        await game.quitCurrentGame(ctx);
    });

    await core.phase('turn challenge mode off', async () => {
        await core.scrollToId(ctx, 'ChallengeModeSwitchSelectors.Root', 'up');
        await core.tapId(ctx, 'ChallengeModeSwitchSelectors.Root');
        await core.expectNoId(ctx, 'ChallengeConditionsRowSelectors.Root');
    });
});
