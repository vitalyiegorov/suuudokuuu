import { expect, test } from '@playwright/test';
import { SettingsOptionSheetSelectors, SettingsScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';

const languagePersistenceTimeoutMilliseconds = 120000;

test('persists cold and loaded languages when reloading immediately after picker dismissal', async ({ page }) => {
    test.setTimeout(languagePersistenceTimeoutMilliseconds);
    await page.goto('/settings');
    const settings = page.getByTestId(SettingsScreenSelectors.Root);
    const sheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
    await expect(settings).toBeVisible();

    for (let selection = 0; selection < 20; selection += 1) {
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

test('dismisses the option sheet only once after repeated selections', async ({ page }) => {
    await launchHome(page);
    await page.getByText('Settings', { exact: true }).click();
    const settings = page.getByTestId(SettingsScreenSelectors.Root);
    await settings.getByTestId(SettingsScreenSelectors.CellSpacingOption).click();
    const sheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
    await expect(sheet).toBeVisible();
    await sheet.getByTestId(`${SettingsOptionSheetSelectors.Option}.2`).evaluate(element => {
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await expect(sheet).not.toBeVisible();
    await expect(page).toHaveURL(/\/settings$/u);
    await expect(settings).toBeVisible();
});

test('surfaces a failed settings write and keeps the sheet available for retry', async ({ page }) => {
    await page.goto('/settings');
    await page.getByTestId(SettingsScreenSelectors.CellSpacingOption).click();
    const sheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
    await expect(sheet).toBeVisible();
    await page.evaluate(() => {
        const postMessage: unknown = Object.getOwnPropertyDescriptor(Worker.prototype, 'postMessage')?.value;
        if (typeof postMessage !== 'function') {
            throw new Error('Worker messaging is unavailable');
        }

        Worker.prototype.postMessage = function (message: unknown) {
            if (Array.isArray(message) && typeof message[1] === 'string' && message[1].startsWith('INSERT OR REPLACE INTO settings')) {
                Object.defineProperty(Worker.prototype, 'postMessage', { value: postMessage });
                this.dispatchEvent(new MessageEvent('message', { data: [message[0], 'Settings write failed'] }));

                return;
            }

            postMessage.call(this, message);
        };
    });
    const dialog = page.waitForEvent('dialog').then(alert => {
        expect(alert.message()).toContain('Settings');

        return alert.accept();
    });
    await sheet.getByTestId(`${SettingsOptionSheetSelectors.Option}.2`).click();
    await dialog;
    await expect(sheet).toBeVisible();
    await sheet.getByTestId(`${SettingsOptionSheetSelectors.Option}.2`).click();
    await expect(sheet).not.toBeVisible();
    await expect(page).toHaveURL(/\/settings$/u);
});
