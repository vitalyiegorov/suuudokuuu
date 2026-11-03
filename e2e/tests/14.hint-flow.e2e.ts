import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

const HINT_LINK = 'suuudokuuu://shared/_MANQGaciM0yz__9dFFCq5FGCkeArJsaswTCLjQ9JvkaI';

async function expectProgress(ctx: core.Ctx, step: number): Promise<void> {
    await core.expectIdText(ctx, 'HintPanelSelectors.Progress', new RegExp(`^Step ${step} of 4$`, 'iu'));
}

async function next(ctx: core.Ctx, times: number): Promise<void> {
    for (let tap = 0; tap < times; tap += 1) {
        await core.tapId(ctx, 'HintPanelSelectors.NextButton');
    }
}

async function expectPlacedFour(ctx: core.Ctx): Promise<void> {
    await core.expectNoId(ctx, 'HintPanelSelectors.Root');
    await core.expectIdText(ctx, 'CellSelectors.Cell.2-1', /^Row 3, column 2, 4$/iu);
}

test('14 hint flow', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('hint narration', async () => {
        await game.openSharedHandoff(ctx, HINT_LINK);
        await core.tapId(ctx, 'HintButtonSelectors.Root');
        await core.expectId(ctx, 'HintPanelSelectors.Root');
        await core.expectIdText(ctx, 'HintStepNarrationSelectors.Technique', /^Pointing Pair$/iu);
        await core.expectIdText(ctx, 'HintStepNarrationSelectors.TechniqueChain', /^Pointing Pair → Hidden Single$/iu);
        await core.expectId(ctx, 'HintStepNarrationSelectors.Narration');
        await expectProgress(ctx, 1);
    });

    await core.phase('step through', async () => {
        await next(ctx, 1);
        await expectProgress(ctx, 2);
        await core.expectIdText(
            ctx,
            'HintStepNarrationSelectors.Narration',
            'In box 6, 4 fits only in the highlighted cells, and they all lie in column 7.'
        );
        await core.tapId(ctx, 'HintPanelSelectors.BackButton');
        await expectProgress(ctx, 1);
        await next(ctx, 3);
        await core.tapId(ctx, 'HintPanelSelectors.BackButton');
        await expectProgress(ctx, 3);
        await core.tapId(ctx, 'HintPanelSelectors.DismissButton');
        await core.expectNoId(ctx, 'HintPanelSelectors.Root');
    });

    await core.phase('apply the hint', async () => {
        await core.tapId(ctx, 'HintButtonSelectors.Root');
        await next(ctx, 3);
        await core.expectIdText(ctx, 'HintPanelSelectors.ApplyButton', /^Place 4$/iu);
        await core.tapId(ctx, 'HintPanelSelectors.ApplyButton');
        await expectPlacedFour(ctx);
        await game.quitCurrentGame(ctx);
    });

    await core.phase('show the answer', async () => {
        await game.openSharedHandoff(ctx, HINT_LINK);
        await core.tapId(ctx, 'HintButtonSelectors.Root');
        await core.tapId(ctx, 'HintPanelSelectors.ShowAnswerButton');
        await expectProgress(ctx, 4);
        await core.tapId(ctx, 'HintPanelSelectors.ApplyButton');
        await expectPlacedFour(ctx);
        await game.quitCurrentGame(ctx);
    });
});
