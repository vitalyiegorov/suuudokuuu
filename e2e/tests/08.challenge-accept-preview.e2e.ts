import { scrollTo } from '@mobile-ci/e2e-simlock/steps';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('08 challenge accept preview', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('open the legacy challenge link', () =>
        game.openSharedChallenge(
            ctx,
            'suuudokuuu://shared/_KAOADKxQxGAEwAiG0eSR7tZLUwnibscwQ0-A5fIIKC45kkWcIIQQQRgYUgCGSyNYgAAAAAAAAAAAAASWSrfOcD6yrHa0SAMNhPEITYFvbWxiFMlBQUFBQUFBQUFBQUFBQUFCQkFAgICAgICBQIFCQIJCQUFCQkFAgICAgICAgICAgICAgICAgICAgICAgIA'
        )
    );

    await core.phase('preview', async () => {
        await core.expectText(ctx, /Nightmare/iu);
        await core.expectNoId(ctx, 'RatingBadgeSelectors.Root');
        await core.expectId(ctx, 'ChallengeAcceptScreenSelectors.OpponentTime');
        await core.expectText(ctx, '03:50');
        await core.expectId(ctx, 'ChallengeAcceptScreenSelectors.Timeline');
        await core.expectText(ctx, 'Taller marks = sharper techniques');
    });

    await core.phase('rival arsenal', async () => {
        await scrollTo(ctx.screen, core.byText(ctx.screen, 'Finned X-Wing'));
        await core.expectId(ctx, 'ChallengeRunStatsSelectors.TechniqueTile.16');
        await core.expectText(ctx, 'Finned X-Wing');
        await scrollTo(ctx.screen, core.byText(ctx.screen, 'Hidden Pair'));
        await core.expectId(ctx, 'ChallengeRunStatsSelectors.TechniqueTile.10');
        await core.expectText(ctx, 'Hidden Pair');
    });

    await core.phase('maybe later', async () => {
        await core.tapId(ctx, 'ChallengeAcceptScreenSelectors.MaybeLaterButton');
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });
});
