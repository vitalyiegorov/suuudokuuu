import type { Page } from '@playwright/test';

export const restoreAppFromBfcache = async (page: Page): Promise<void> => {
    await page.evaluate(() => {
        window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });
};
