import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

const PLACED = /^Row 1, column 4, 5$/iu;

test('20 undo redo', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('place a value', async () => {
        await game.openSharedHandoff(ctx, 'suuudokuuu://shared/_MAPkUf6Fze86dvjf01NSzI894_I-hYooTW031nXI0CXNxABA');
        await core.expectId(ctx, 'UndoButtonSelectors.Root');
        await core.expectId(ctx, 'RedoButtonSelectors.Root');
        await core.tapId(ctx, 'CellSelectors.Cell.0-3');
        await core.tapId(ctx, 'AvailableValueItemSelectors.Button.5');
        await core.expectIdText(ctx, 'GameScreenSelectors.Score', /[1-9]/u);
        await core.expectIdText(ctx, 'CellSelectors.Cell.0-3', PLACED);
    });

    await core.phase('undo and redo', async () => {
        await core.tapId(ctx, 'UndoButtonSelectors.Root');
        await core.expectNoIdText(ctx, 'CellSelectors.Cell.0-3', PLACED);
        await core.tapId(ctx, 'RedoButtonSelectors.Root');
        await core.expectIdText(ctx, 'CellSelectors.Cell.0-3', PLACED);
        await game.quitCurrentGame(ctx);
    });
});
