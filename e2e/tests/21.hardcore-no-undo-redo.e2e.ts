import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('21 hardcore no undo redo', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('hardcore hides undo and redo', async () => {
        await game.openSharedHandoff(
            ctx,
            'suuudokuuu://shared/_NABHQzBFw6RglyoiRQQUouMgjrAma5QGGoYAggggggggggggggggghCEIQiEIQhCEIREREREklQL1IJUTJSvlHjqmsZOolrdPSOtkgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgQIECBAgAAAA'
        );
        await core.expectText(ctx, '0/0');
        await core.expectNoId(ctx, 'UndoButtonSelectors.Root');
        await core.expectNoId(ctx, 'RedoButtonSelectors.Root');
    });

    await core.phase('still hidden after a move', async () => {
        await core.tapId(ctx, 'CellSelectors.Cell.4-7');
        await core.tapId(ctx, 'AvailableValueItemSelectors.Button.7');
        await core.expectIdText(ctx, 'GameScreenSelectors.Score', /[1-9]/u);
        await core.expectNoId(ctx, 'UndoButtonSelectors.Root');
        await core.expectNoId(ctx, 'RedoButtonSelectors.Root');
        await game.quitCurrentGame(ctx);
    });
});
