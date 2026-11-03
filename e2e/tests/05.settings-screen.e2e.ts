import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('05 settings screen', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('settings sections', async () => {
        await game.openSettings(ctx);
        await core.expectText(ctx, 'Game');
        await core.expectText(ctx, /^Language/iu);
        await core.expectText(ctx, /^Number size/iu);
        await core.expectText(ctx, /^Cell spacing/iu);
        await core.scrollTo(ctx, core.byText(ctx.screen, 'Display'));
        await core.scrollTo(ctx, core.byText(ctx.screen, 'Dark mode'));
    });

    await core.phase('cell spacing sheet', async () => {
        await core.tapId(ctx, 'SettingsScreenSelectors.CellSpacingOption');
        await core.expectId(ctx, 'SettingsOptionSheetSelectors.Root');
        await core.tapId(ctx, 'SettingsOptionSheetSelectors.Option.5');
        await core.expectNoId(ctx, 'SettingsOptionSheetSelectors.Root');
    });

    await core.phase('footer and privacy policy', async () => {
        await core.scrollToId(ctx, 'SettingsAppFooterSelectors.PrivacyPolicyLink');
        await core.scrollDown(ctx);
        await core.expectId(ctx, 'SettingsAppFooterSelectors.ReportBugLink');
        await core.expectId(ctx, 'SettingsAppFooterSelectors.PrivacyPolicyLink');
        await core.tapId(ctx, 'SettingsAppFooterSelectors.PrivacyPolicyLink');
        await core.expectId(ctx, 'PrivacyPolicyScreenSelectors.Root');
        await core.tapId(ctx, 'HeaderBackButtonSelectors.Root');
        await core.expectId(ctx, 'SettingsScreenSelectors.Root');
        await core.goHome(ctx);
    });
});
