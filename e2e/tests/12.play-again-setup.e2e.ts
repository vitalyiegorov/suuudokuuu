import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

async function loseAndPlayAgain(ctx: core.Ctx, cell: string): Promise<void> {
    await core.tapId(ctx, cell);
    await core.tapId(ctx, 'AvailableValueItemSelectors.Button.5');
    await core.expectId(ctx, 'loser-screen');
    await core.expectText(ctx, /Hard.*Hardcore/iu);
    await core.tapId(ctx, 'loser-screen-play-again-button');
    await core.expectId(ctx, 'GameScreenSelectors.Root', core.WAIT_SLOW);
    await core.expectText(ctx, '0/0');
}

test('12 play again setup', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('casual hardcore run', async () => {
        await game.openSharedHandoff(
            ctx,
            'suuudokuuu://shared/_NABHQzBFw6RglyoiRQQUouMgjrAma5QGGoYAggggggggggggggggghCEIQiEIQhCEIREREREklQL1IJUTJSvlHjqmsZOolrdPSOtkgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgAAAA'
        );
        await core.expectText(ctx, '0/0');
        await core.expectId(ctx, 'GameScreenSelectors.ShareButton');
        await core.expectNoId(ctx, 'ChallengeRecordHudSelectors.Root');
        await core.expectNoId(ctx, 'GameScreenSelectors.Rating');
        await loseAndPlayAgain(ctx, 'CellSelectors.Cell.4-7');
        await core.expectId(ctx, 'GameScreenSelectors.ShareButton');
        await core.expectNoId(ctx, 'ChallengeRecordHudSelectors.Root');
        await core.expectNoId(ctx, 'GameScreenSelectors.Rating');
        await game.quitCurrentGame(ctx);
    });

    await core.phase('challenge hardcore run', async () => {
        await game.openSharedHandoff(
            ctx,
            'suuudokuuu://shared/_NQAAB2wJqDtYxGE6y8YRKh82MBHPRMFSeYYAAgggggggggggggggghCEIQiEIQhCEIREREREklQiINYhMte9UhI-rk0UUjE1sxT1bAQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgAAAAAAAAA'
        );
        await core.expectId(ctx, 'ChallengeRecordHudSelectors.Root');
        await core.expectNoId(ctx, 'GameScreenSelectors.ShareButton');
        await core.expectNoId(ctx, 'GameScreenSelectors.Rating');
        await loseAndPlayAgain(ctx, 'CellSelectors.Cell.4-1');
        await core.expectId(ctx, 'ChallengeRecordHudSelectors.Root');
        await core.expectNoId(ctx, 'GameScreenSelectors.ShareButton');
        await core.expectNoId(ctx, 'GameScreenSelectors.Rating');
        await game.quitCurrentGame(ctx);
    });
});
