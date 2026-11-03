import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('17 rated challenge lose rating', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('accept the rated challenge', async () => {
        await game.openSharedChallenge(ctx, 'suuudokuuu://shared/_OQP3__7X7_7r____zMOSjkyv8nqM0LfkydkEBSLStwgSBis7M6rv28ZIIAIiAZAgAAEKAA');
        await game.acceptSharedChallenge(ctx);
        await core.expectId(ctx, 'ChallengeRaceHudSelectors.Root');
    });

    await core.phase('run out of mistakes', async () => {
        await game.runOutOfMistakes(ctx);
        await core.expectIdText(ctx, 'ChallengeResultScreenSelectors.OutcomeValue', / · \d+\.\d\+? · /u);
    });

    await core.phase('try again', async () => {
        await core.tapId(ctx, 'ChallengeTryAgainButtonSelectors.Root');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.quitCurrentGame(ctx);
    });
});
