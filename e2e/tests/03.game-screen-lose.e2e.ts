import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('03 game screen lose', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('accept the shared challenge', async () => {
        await game.openSharedChallenge(ctx, 'suuudokuuu://shared/_KAP3__7X7_7r____zMOSjkyv8nqM0LfkydkEBSLStwgSBis7M6rv28ZIIBEZAA');
        await game.acceptSharedChallenge(ctx);
        await core.expectId(ctx, 'ChallengeRaceHudSelectors.Root');
        await core.expectText(ctx, '0/3');
    });

    await core.phase('run out of mistakes', async () => {
        await game.runOutOfMistakes(ctx);
    });

    await core.phase('result screen and try again', async () => {
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.YourTimeValue');
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.OpponentTimeValue');
        await core.expectText(ctx, /Out of mistakes/iu);
        await core.expectText(ctx, 'Did not finish the board');
        await core.expectId(ctx, 'ChallengeTryAgainButtonSelectors.Root');
        await core.tapId(ctx, 'ChallengeTryAgainButtonSelectors.Root');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.quitCurrentGame(ctx);
    });
});
