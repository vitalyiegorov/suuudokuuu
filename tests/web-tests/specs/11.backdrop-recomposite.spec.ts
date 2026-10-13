import { type Page, expect, test } from '@playwright/test';
import { HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';

declare global {
    interface Window {
        backdropFilterChanges: string[];
    }
}

const watchBackdropFilterChanges = async (page: Page): Promise<number> =>
    page.evaluate(() => {
        window.backdropFilterChanges = [];

        const blurredElements = [...document.querySelectorAll('#root *')].filter(element => {
            const computedStyle = getComputedStyle(element);
            const standardValue = computedStyle.getPropertyValue('backdrop-filter');
            const webkitValue = computedStyle.getPropertyValue('-webkit-backdrop-filter');
            const appliedValue = standardValue === '' ? webkitValue : standardValue;

            return appliedValue !== '' && appliedValue !== 'none';
        });

        blurredElements.forEach((element, index) => {
            const observer = new MutationObserver(() => {
                const computedStyle = getComputedStyle(element);
                const standardValue = computedStyle.getPropertyValue('backdrop-filter');
                const webkitValue = computedStyle.getPropertyValue('-webkit-backdrop-filter');
                const appliedValue = standardValue === '' ? webkitValue : standardValue;

                window.backdropFilterChanges.push(`${index}:${appliedValue === 'none' ? 'cleared' : 'restored'}`);
            });

            observer.observe(element, { attributes: true, attributeFilter: ['style'] });
        });

        return blurredElements.length;
    });

const readBackdropFilterChanges = (page: Page): Promise<string[]> =>
    page.evaluate(
        () =>
            new Promise<string[]>(resolve => {
                requestAnimationFrame(() => void requestAnimationFrame(() => void resolve([...window.backdropFilterChanges])));
            })
    );

const firstLayerCleared = '0:cleared';
const firstLayerRestored = '0:restored';

test('clears and restores the backdrop-filter layers when the app returns to visibility', async ({ page }) => {
    await launchHome(page);
    const watchedLayerCount = await watchBackdropFilterChanges(page);
    expect(watchedLayerCount).toBeGreaterThan(0);

    await sendAppToBackground(page);
    await bringAppToForeground(page);

    const changes = await readBackdropFilterChanges(page);
    expect(changes).toContain(firstLayerCleared);
    expect(changes).toContain(firstLayerRestored);
    expect(changes.indexOf(firstLayerCleared)).toBeLessThan(changes.indexOf(firstLayerRestored));

    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});

test('clears and restores the backdrop-filter layers when the page is restored from the bfcache', async ({ page }) => {
    await launchHome(page);
    const watchedLayerCount = await watchBackdropFilterChanges(page);
    expect(watchedLayerCount).toBeGreaterThan(0);

    await page.evaluate(() => {
        window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });

    const changes = await readBackdropFilterChanges(page);
    expect(changes).toContain(firstLayerCleared);
    expect(changes).toContain(firstLayerRestored);

    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});
