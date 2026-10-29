import { expect, test } from '@playwright/test';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';
import { valueButtonTestId } from '../src/utils/test-id.util';

for (const portrait of [
    { width: 375, height: 667 },
    { width: 768, height: 1024 }
]) {
    test(`resizes active numpad digits through ${portrait.width}×${portrait.height} and back`, async ({ page }) => {
        await page.setViewportSize(portrait);
        await launchHome(page);
        await startNewGame(page);
        const digit = page.getByTestId(valueButtonTestId(9));
        await expect(digit).toHaveCSS('width', '56px');
        await expect(digit).toHaveCSS('height', '56px');
        const portraitFontSize = await digit.getByText('9', { exact: true }).evaluate(element => getComputedStyle(element).fontSize);

        await page.setViewportSize({ width: 1440, height: 900 });
        await expect(digit).toHaveCSS('width', '88px');
        await expect(digit).toHaveCSS('height', '88px');

        await page.setViewportSize(portrait);
        await expect(digit).toHaveCSS('width', '56px');
        await expect(digit).toHaveCSS('height', '56px');
        await expect(digit.getByText('9', { exact: true })).toHaveCSS('font-size', portraitFontSize);
        for (const value of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            await expect(page.getByTestId(valueButtonTestId(value))).toBeInViewport({ ratio: 1 });
        }

        await page.setViewportSize({ width: 1440, height: 900 });
        await expect(digit).toHaveCSS('width', '88px');
    });
}
