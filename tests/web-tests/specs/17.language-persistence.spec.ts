import { expect, test } from '@playwright/test';
import { GameScreenSelectors, SettingsOptionSheetSelectors, SettingsScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

test('persists cold and loaded languages when reloading immediately after picker dismissal', async ({ page }) => {
    await page.goto('/settings');
    const settings = page.getByTestId(SettingsScreenSelectors.Root);
    const sheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
    await expect(settings).toBeVisible();

    for (let selection = 0; selection < 2; selection += 1) {
        const language = selection % 2 === 0 ? 'ar' : 'en';
        await settings.getByText(/^(?:Language|اللغة)$/u).click();
        await expect(sheet).toBeVisible();
        await sheet.getByTestId(`${SettingsOptionSheetSelectors.Option}.${language}`).click();
        await expect(sheet).not.toBeVisible();
        await page.waitForURL('/settings');
        await page.reload();
        await expect(settings).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', language);
        await expect(settings.getByText(language === 'ar' ? 'العربية' : 'English', { exact: true })).toBeVisible();
    }
});

for (const dismiss of [false, true]) {
    test(`keeps settings after a pending save with dismissal ${dismiss}`, async ({ page }) => {
        await page.addInitScript(() => {
            window.Worker = class extends Worker {
                override postMessage(message: unknown) {
                    if (
                        Array.isArray(message) &&
                        typeof message[1] === 'string' &&
                        /^INSERT OR REPLACE INTO settings/iu.test(message[1]) &&
                        document.documentElement.dataset['settingsSavePending'] !== 'true'
                    ) {
                        document.documentElement.dataset['settingsSavePending'] = 'true';
                        window.addEventListener('release-settings-save', () => void super.postMessage(message, []), { once: true });
                    } else {
                        super.postMessage(message, []);
                    }
                }
            };
        });
        await launchHome(page);
        await startNewGame(page);
        await page.getByTestId(GameScreenSelectors.SettingsButton).click();
        const settings = page.getByTestId(SettingsScreenSelectors.Root);
        await expect(settings).toBeVisible();
        await page.getByTestId(SettingsScreenSelectors.CellSpacingOption).click();
        const sheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
        await sheet.getByText('Spacious', { exact: true }).click();
        await expect(page.locator('html')).toHaveAttribute('data-settings-save-pending', 'true');
        if (dismiss) {
            await page.keyboard.press('Escape');
            await expect(sheet).not.toBeVisible();
        } else {
            await sheet.getByText('Tight', { exact: true }).click();
        }
        await page.evaluate(() => window.dispatchEvent(new Event('release-settings-save')));
        await expect(sheet).not.toBeVisible();
        await expect(settings).toBeVisible();
        await expect(page.getByTestId(SettingsScreenSelectors.CellSpacingOption)).toContainText('Spacious');
        await page.evaluate(
            () =>
                new Promise<void>(resolve => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            resolve();
                        });
                    });
                })
        );
        await expect(page).toHaveURL('/game-settings');
        await expect(page.getByTestId(SettingsScreenSelectors.CellSpacingOption)).toContainText('Spacious');
    });
}
