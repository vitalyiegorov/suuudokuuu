import * as core from '../support/suuudokuuu/core.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('16 rated challenge win rating', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start('rated-result');

    await core.phase('challenge result', async () => {
        await core.openLink(ctx, 'suuudokuuu://challenge-won');
        await core.expectId(ctx, 'ChallengeResultScreenSelectors.OutcomeValue', core.WAIT_SLOW);
        await core.expectIdText(ctx, 'ChallengeResultScreenSelectors.OutcomeValue', / · \d+\.\d\+? · /u);
    });

    await core.phase('back home', async () => {
        await core.scrollToId(ctx, 'ChallengeResultFooterSelectors.HomeButton');
        await core.tapId(ctx, 'ChallengeResultFooterSelectors.HomeButton');
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });
});
