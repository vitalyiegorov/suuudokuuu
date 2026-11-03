import { byId, scrollTo } from '@mobile-ci/e2e-simlock/steps';

import * as core from '../support/suuudokuuu/core.ts';
import * as game from '../support/suuudokuuu/game.ts';
import { test } from '../support/suuudokuuu/test.ts';

test('10 themes screen', async ({ suuudokuuu }) => {
    const { ctx } = suuudokuuu;
    await suuudokuuu.start();

    await core.phase('open themes', async () => {
        await game.openSettings(ctx);
        await core.scrollToId(ctx, 'SettingsScreenSelectors.ThemeOption');
        await core.tapId(ctx, 'SettingsScreenSelectors.ThemeOption');
        await core.expectId(ctx, 'themes-screen');
        await core.expectText(ctx, 'Presets');
    });

    await core.phase('create a theme', async () => {
        await core.expectId(ctx, 'themes-screen-create-button');
        await core.tapId(ctx, 'themes-screen-create-button');
        await core.expectId(ctx, 'theme-editor-screen');
        const name = byId(ctx.screen, 'theme-editor-screen-name-input');
        await name.clear();
        await name.fill('Maestro theme');
        await ctx.device.dismissKeyboard();
        await core.expectId(ctx, 'theme-editor-screen-save-button');
        await core.tapId(ctx, 'theme-editor-screen-save-button');
        await core.expectId(ctx, 'themes-screen');
        await scrollTo(ctx.screen, core.byText(ctx.screen, 'Maestro theme'));
    });

    await core.phase('theme shows in settings', async () => {
        await core.tapId(ctx, 'HeaderBackButtonSelectors.Root');
        await core.expectId(ctx, 'SettingsScreenSelectors.Root');
        await core.scrollToId(ctx, 'SettingsScreenSelectors.ThemeOption', 'up');
        await core.expectIdText(ctx, 'SettingsScreenSelectors.ThemeOption', /Maestro theme/iu);
        await core.goHome(ctx);
    });
});
