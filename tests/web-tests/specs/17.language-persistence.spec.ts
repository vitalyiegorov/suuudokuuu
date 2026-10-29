import { expect, test } from '@playwright/test';
import { SettingsOptionSheetSelectors, SettingsScreenSelectors } from '@suuudokuuu/app/src/selectors';

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
