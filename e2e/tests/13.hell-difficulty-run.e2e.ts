import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

const EMBER = /^HomeScreenStartButtonEmberSelectors\.(AnimatedRoot|StaticRoot)$/u;

test('13 hell difficulty run', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('pick hell', async () => {
        await core.scrollTo(ctx, core.byText(ctx.screen, 'Difficulty'), 'up');
        await core.tapId(ctx, 'DifficultyComplexityOptionSelectors.Option.Hell');
        await core.scrollToId(ctx, EMBER);
    });

    await core.phase('hell run', async () => {
        await game.startNewGame(ctx);
        await core.expectNoId(ctx, 'GameScreenSelectors.Level');
        await game.pauseCurrentGame(ctx);
        await core.expectIdText(ctx, 'PauseScreenSelectors.DetailsValue', /Hell · \d+\.\d/iu);
        await core.tapId(ctx, 'PauseScreenSelectors.ResumeButton');
        await core.expectId(ctx, 'GameScreenSelectors.Root');
        await game.quitCurrentGame(ctx);
        await core.scrollToId(ctx, EMBER);
    });
});
