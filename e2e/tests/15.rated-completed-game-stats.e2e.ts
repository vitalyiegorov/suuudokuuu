import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('15 rated completed game stats', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start('rated-history');

    await core.phase('history techniques', async () => {
        await game.openHistory(ctx);
        await core.expectId(ctx, 'HistoryTechniquesSelectors.Root');
        await core.expectId(ctx, 'HistoryTechniquesSelectors.BestTechnique');
    });

    await core.phase('rated completed game', async () => {
        await game.openNewbieHistory(ctx);
        await core.expectId(ctx, 'HistoryGamesScreenSelectors.Root');
        await core.expectIdText(ctx, 'CompletedGameItemSelectors.DifficultyValue', / · \d+\.\d/u);
        await core.tapId(ctx, 'HeaderBackButtonSelectors.Root');
        await core.expectId(ctx, 'HistoryScreenSelectors.Root');
    });

    await core.phase('solver profile', async () => {
        await core.scrollToId(ctx, 'HistorySolverProfileSelectors.HardestSolve');
        await core.scrollToId(ctx, 'HistorySolverProfileSelectors.Spectrum');
        await core.goHome(ctx);
    });
});
