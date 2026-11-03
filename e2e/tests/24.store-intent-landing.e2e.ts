import * as core from '../support/suuudokuuu/core.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('24 store intent landing', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('intent spotlight', async () => {
        await core.openLink(ctx, 'suuudokuuu://start/expert');
        await core.expectId(ctx, 'HomeScreenIntentSpotlightSelectors.Root', core.WAIT_QUICK);
        await core.expectText(ctx, 'Ready for a real challenge');
        await core.expectId(ctx, 'HomeScreenIntentSpotlightSelectors.Setup');
        await core.expectText(ctx, 'Nightmare');
        await core.scrollToId(ctx, 'HomeScreenSelectors.StartButton');
        await core.expectIdText(ctx, 'HomeScreenSelectors.StartButton', /Nightmare • Standard/iu);
        await core.scrollDown(ctx);
    });

    await core.phase('dismiss', async () => {
        await core.openLink(ctx, 'suuudokuuu://start/expert');
        await core.expectId(ctx, 'HomeScreenIntentSpotlightSelectors.Dismiss', core.WAIT_QUICK);
        await core.tapId(ctx, 'HomeScreenIntentSpotlightSelectors.Dismiss');
        await core.expectNoId(ctx, 'HomeScreenIntentSpotlightSelectors.Root', core.WAIT_QUICK);
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });
});
