import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

async function pausedDetails(ctx: core.Ctx, details: RegExp): Promise<void> {
    await game.pauseCurrentGame(ctx);
    await core.expectIdText(ctx, 'PauseScreenSelectors.DetailsValue', details);
    await core.tapId(ctx, 'PauseScreenSelectors.ResumeButton');
    await core.expectId(ctx, 'GameScreenSelectors.Root');
    await game.quitCurrentGame(ctx);
}

test('14 infinity difficulty run', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('infinity run', async () => {
        await core.scrollTo(ctx, core.byText(ctx.screen, 'Difficulty'), 'up');
        await core.tapId(ctx, 'DifficultyComplexityOptionSelectors.Option.Infinity');
        await core.scrollTo(ctx, core.byText(ctx.screen, 'World-record puzzles'));
        await game.startNewGame(ctx);
        await core.expectNoId(ctx, 'GameScreenSelectors.Level');
        await pausedDetails(ctx, /Infinity · \d+\.\d\+? • /iu);
    });

    await core.phase('shared infinity puzzle', async () => {
        await core.openLink(ctx, 'suuudokuuu://shared/_MAMJlEGYQgogQQwoQHLAZUKyZ9jOXdg');
        await core.expectId(ctx, 'SharedScreenSelectors.Root');
        await core.expectId(ctx, 'SharedScreenSelectors.Meta');
        await core.expectText(ctx, 'Infinity · 11.9');
        await core.tapId(ctx, 'SharedScreenSelectors.ConfirmButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await core.expectNoId(ctx, 'GameScreenSelectors.Level');
        await pausedDetails(ctx, /Infinity · 11\.9/iu);
    });
});
