import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('02 game screen win', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('win the shared challenge', () =>
        game.completeWinningSharedChallenge(ctx, 'suuudokuuu://shared/_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-')
    );

    await core.phase('result screen', async () => {
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.YourTimeValue');
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.OpponentTimeValue');
        await core.expectText(ctx, /You beat your rival/iu);
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.MarginValue');
        await core.scrollToId(ctx, 'ChallengeResultScreenSelectors.UkraineSupportCta');
        await core.tapId(ctx, 'ChallengeResultFooterSelectors.HomeButton');
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });
});
