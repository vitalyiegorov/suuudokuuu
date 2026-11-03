import { setTimeout as sleep } from 'node:timers/promises';

import { expect } from 'e2e';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('01 home screen', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('home setup', async () => {
        await core.scrollTo(ctx, core.byText(ctx.screen, 'Difficulty'), 'up');
        await core.expectText(ctx, 'Difficulty');
        await core.expectText(ctx, 'Newbie');
        await core.expectText(ctx, 'Mistakes');
    });

    await core.phase('start and inspect a game', async () => {
        await game.startNewGame(ctx);
        await expect(core.byId(ctx.screen, 'GameScreenSelectors.Score')).toHaveText('0');
        await core.expectText(ctx, '0/3');
        await core.expectNoId(ctx, 'GameScreenSelectors.Level');
        await core.expectNoId(ctx, 'GameScreenSelectors.Rating');
        await game.quitCurrentGame(ctx);
    });

    await core.phase('rapid start taps open one game', async () => {
        await core.scrollToId(ctx, 'HomeScreenSelectors.StartButton');
        await core.scrollDown(ctx);
        const start = await core.byId(ctx.screen, 'HomeScreenSelectors.StartButton').boundingBox();
        if (start === null) {
            throw new Error('HomeScreenSelectors.StartButton has no bounds');
        }
        for (let tap = 0; tap < 5; tap += 1) {
            await ctx.screen.tapAt({ x: start.x + start.width / 2, y: start.y + start.height / 2 });
            await sleep(50);
        }
        await core.expectId(ctx, 'GameScreenSelectors.Root', core.WAIT_SLOW);
        await game.quitCurrentGame(ctx);
    });
});
