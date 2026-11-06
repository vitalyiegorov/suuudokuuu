import { byId } from '@mobile-ci/e2e-simlock/steps';
import { expect } from 'e2e';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

const IMPORT_LINK = 'suuudokuuu://import?puzzle=003020600900305001001806400008102900700000008006708200002609500800203009005010300';

async function status(ctx: core.Ctx, text: string | RegExp, timeout = core.WAIT_QUICK): Promise<void> {
    await expect(byId(ctx.screen, 'ImportScreenSelectors.Status')).toHaveText(text, { timeout });
}

test('25 import puzzle', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('open import', async () => {
        await core.tapId(ctx, 'MainTabSelectors.Play');
        await core.scrollToId(ctx, 'HomeScreenSelectors.ImportLink');
        await core.scrollDown(ctx);
        await core.tapId(ctx, 'HomeScreenSelectors.ImportLink');
        await core.expectId(ctx, 'ImportScreenSelectors.ScanButton', core.WAIT_QUICK);
        await core.expectId(ctx, 'ImportScreenSelectors.PhotosButton', core.WAIT_QUICK);
        await core.tapId(ctx, 'ImportScreenSelectors.TypeButton');
        await status(ctx, 'Tap a cell to type it');
    });

    await core.phase('type, conflict, clear, reset', async () => {
        await core.tapId(ctx, 'ImportScreenSelectors.Cell.0-0');
        await core.tapId(ctx, 'ImportScreenSelectors.PadValue.5');
        await status(ctx, '1 clue · more than one solution');
        await core.tapId(ctx, 'ImportScreenSelectors.PadValue.5');
        await status(ctx, 'Two 5s in row 1');
        await expect(byId(ctx.screen, 'ImportScreenSelectors.PlayButton')).toBeDisabled();
        await core.tapId(ctx, 'ImportScreenSelectors.Cell.0-1');
        await core.tapId(ctx, 'ImportScreenSelectors.ClearButton');
        await status(ctx, '1 clue · more than one solution');
        await core.tapId(ctx, 'ImportScreenSelectors.ResetButton');
        await core.expectId(ctx, 'ImportScreenSelectors.PasteButton', core.WAIT_QUICK);
    });

    await core.phase('swipe the sheet away', async () => {
        const title = await byId(ctx.screen, 'ImportScreenSelectors.Title').boundingBox();
        if (title === null) {
            throw new Error('ImportScreenSelectors.Title has no bounds');
        }
        const middle = { x: title.x + title.width / 2, y: title.y + title.height / 2 };
        await ctx.screen.swipe({ from: middle, to: { x: middle.x, y: middle.y + 500 }, duration: 400 });
        await core.expectNoId(ctx, 'ImportScreenSelectors.Root', core.WAIT_QUICK);
        await core.expectId(ctx, 'HomeScreenSelectors.Root');
    });

    await core.phase('import from a link and play', async () => {
        await core.openLink(ctx, IMPORT_LINK);
        await status(ctx, 'One solution · Newbie · SE 2.3', core.WAIT_DEFAULT);
        await core.tapId(ctx, 'ImportScreenSelectors.PlayButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.pauseCurrentGame(ctx);
        await core.expectIdText(ctx, 'PauseScreenSelectors.DetailsValue', /Newbie · 2\.3/iu);
        await core.tapId(ctx, 'PauseScreenSelectors.ResumeButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
    });

    await core.phase('import over a live run', async () => {
        await core.openLink(ctx, IMPORT_LINK);
        await status(ctx, 'One solution · Newbie · SE 2.3', core.WAIT_DEFAULT);
        await core.tapId(ctx, 'ImportScreenSelectors.PlayButton');
        await core.expectText(ctx, 'Stop current run?', core.WAIT_QUICK);
        await ctx.screen.getByRole('button', { name: 'OK' }).last().tap();
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.quitCurrentGame(ctx);
    });
});
