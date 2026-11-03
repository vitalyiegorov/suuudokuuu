import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('18 daily challenge', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('play today', async () => {
        await game.openDaily(ctx);
        await core.expectIdText(ctx, 'DailyScreenSelectors.ActionButton', /Play today/iu);
        await core.tapId(ctx, 'DailyScreenSelectors.ActionButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root', core.WAIT_SLOW);
        await game.quitCurrentGame(ctx);
    });
});
