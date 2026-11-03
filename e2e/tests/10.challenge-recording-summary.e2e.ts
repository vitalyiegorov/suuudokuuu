import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('10 challenge recording summary', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('finish the recorded run', async () => {
        await game.openSharedHandoff(
            ctx,
            'suuudokuuu://shared/_N2P________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMAqVUFCWAAAAAAAA'
        );
        await core.expectId(ctx, 'ChallengeRecordHudSelectors.Root');
        await core.tapId(ctx, 'CellSelectors.Cell.6-0');
        await core.tapId(ctx, 'InputModeButtonSelectors.Root');
        await core.expectId(ctx, 'CandidateInputItemSelectors.Button.2');
        await core.tapId(ctx, 'CandidateInputItemSelectors.Button.2');
        await core.tapId(ctx, 'InputModeButtonSelectors.Root');
        await core.expectId(ctx, 'AvailableValueItemSelectors.Button.2');
        await core.tapId(ctx, 'AvailableValueItemSelectors.Button.2');
        await core.expectId(ctx, 'WinnerScreenSelectors.Root', core.WAIT_SLOW);
    });

    await core.phase('run summary', async () => {
        await core.expectId(ctx, 'ChallengeRunSummarySelectors.Root');
        await core.scrollToId(ctx, 'ChallengeRunStatsSelectors.PencilTile');
        await core.expectText(ctx, 'Pencil marks');
        await core.expectIdText(ctx, 'ChallengeRunStatsSelectors.PencilTile.Count', /^1$/u);
        await core.expectId(ctx, 'ChallengeRunStatsSelectors.ExitsTile');
        await core.expectText(ctx, /20s away/iu);
        await core.expectIdText(ctx, 'ChallengeRunStatsSelectors.ExitsTile.Count', /^1$/u);
        await core.expectNoId(ctx, 'ChallengeRunStatsSelectors.CleanRunTile');
        await core.expectNoId(ctx, 'ChallengeRunStatsSelectors.ScreenshotsTile');
    });

    await core.phase('winner screen', async () => {
        await core.scrollToId(ctx, 'ChallengeRunStatsSelectors.Root');
        await core.scrollToId(ctx, 'WinnerScreenSelectors.TimeValue');
        await core.expectId(ctx, 'WinnerScreenSelectors.MistakesValue');
        await core.expectText(ctx, 'Challenge');
        await core.expectId(ctx, 'WinnerScreenSelectors.PlayAgainButton');
        await core.tapId(ctx, 'WinnerScreenSelectors.HomeButton');
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });
});
