import { byId, scrollTo } from '@mobile-ci/e2e-simlock/steps';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('04 statistics screen', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start('unrated-history');

    await core.phase('history', async () => {
        await game.openHistory(ctx);
        await scrollTo(ctx.screen, core.byText(ctx.screen, /games? played/iu));
        await core.expectText(ctx, /^Newbie/iu);
        await core.scrollDown(ctx);
        await core.tapId(ctx, 'HistoryDifficultySelectors.Card.Newbie');
        await core.expectId(ctx, 'CompletedGameItemSelectors.ReplayButton');
    });

    await core.phase('completed games', async () => {
        await core.expectId(ctx, 'HistoryGamesSummaryBandSelectors.Root');
        await core.expectText(ctx, 'Score');
        await core.expectText(ctx, 'Time');
        await core.expectText(ctx, 'Mistakes');
        await core.expectIdText(ctx, 'CompletedGameItemSelectors.DifficultyValue', /^Newbie$/iu);
        await core.expectId(ctx, 'CompletedGameTechniqueSummarySelectors.Root');
    });

    await core.phase('replay', async () => {
        await core.tapId(ctx, 'CompletedGameItemSelectors.ReplayButton');
        await core.expectId(ctx, 'ReplayControlsSelectors.Root');
        await core.expectIdText(ctx, 'ReplayHeaderSelectors.Level', /^Newbie$/iu);
        await core.tapId(ctx, 'ReplayControlsSelectors.NextButton');
        await core.expectText(ctx, 'Move 1 / 1', core.WAIT_SLOW);
        await core.tapId(ctx, 'ReplayControlsSelectors.PreviousButton');
        await core.expectText(ctx, 'Move 0 / 1', core.WAIT_SLOW);
        const scrubber = await byId(ctx.screen, 'ReplayScrubberSelectors.Root').boundingBox();
        if (scrubber === null) {
            throw new Error('ReplayScrubberSelectors.Root has no bounds');
        }
        const middle = { x: scrubber.x + scrubber.width / 2, y: scrubber.y + scrubber.height / 2 };
        await ctx.screen.swipe({ from: middle, to: { x: scrubber.x + scrubber.width - 1, y: middle.y }, duration: 400 });
        await core.expectText(ctx, 'Move 1 / 1', core.WAIT_SLOW);
        await core.tapId(ctx, 'ReplayControlsSelectors.PreviousButton');
        await core.expectText(ctx, 'Move 0 / 1', core.WAIT_SLOW);
        await core.expectId(ctx, 'ReplayShareActionSelectors.Button');
    });

    await core.phase('back to home', async () => {
        await game.leaveReplayForHome(ctx);
    });
});
