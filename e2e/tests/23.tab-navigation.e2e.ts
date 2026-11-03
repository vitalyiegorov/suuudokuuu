import * as core from '../support/suuudokuuu/core.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('23 tab navigation', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('tabs', async () => {
        for (const [tab, root] of [
            ['Settings', 'SettingsScreenSelectors.Root'],
            ['Stats', 'HistoryScreenSelectors.Root'],
            ['Daily', 'DailyScreenSelectors.Root'],
            ['Play', 'HomeScreenSelectors.Root']
        ]) {
            await core.tapId(ctx, `MainTabSelectors.${tab}`);
            await core.expectId(ctx, root);
        }
    });
});
