import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('22 challenge over live game', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('win a challenge over a live game', async () => {
        await game.startNewGame(ctx);
        await game.completeWinningSharedChallenge(
            ctx,
            'suuudokuuu://shared/_OWP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMARgH-IAABCg'
        );
        await core.scrollToId(ctx, 'ChallengeResultFooterSelectors.HomeButton');
        await core.tapId(ctx, 'ChallengeResultFooterSelectors.HomeButton');
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });

    await core.phase('the win shows in history', async () => {
        await game.openHistory(ctx);
        await game.openNewbieHistory(ctx);
        await core.expectId(ctx, 'CompletedGameTechniqueSummarySelectors.Root');
        await core.tapId(ctx, 'CompletedGameItemSelectors.ReplayButton');
        await core.expectText(ctx, 'Move 0 / 1', core.WAIT_SLOW);
        await core.tapId(ctx, 'ReplayControlsSelectors.NextButton');
        await core.expectText(ctx, 'Move 1 / 1', core.WAIT_SLOW);
    });

    await core.phase('back home', async () => {
        await game.leaveReplayForHome(ctx);
    });
});
