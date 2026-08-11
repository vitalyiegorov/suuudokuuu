import type { Page } from '@playwright/test';

export const bringAppToForeground = async (page: Page): Promise<void> => {
    await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
        document.dispatchEvent(new Event('visibilitychange'));
    });
};
