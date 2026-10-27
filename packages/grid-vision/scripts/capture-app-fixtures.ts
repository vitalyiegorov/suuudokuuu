import { chromium } from '@playwright/test';

import { writeFixture } from './shared/write-fixture';

import type { Browser, Page } from '@playwright/test';

const { APP_URL = 'http://127.0.0.1:4173' } = process.env;
const SCREEN_TIMEOUT_MILLISECONDS = 20_000;
const JPEG_QUALITY = 82;
const GRID_SIZE = 9;
const MOBILE_VIEWPORT = { width: 390, height: 780 };
const DESKTOP_VIEWPORT = { width: 800, height: 600 };

interface CaptureInterface {
    readonly theme: string;
    readonly isDark: boolean;
    readonly viewport: { readonly width: number; readonly height: number };
}

const captures: readonly CaptureInterface[] = ['Classic', 'Gold', 'Newspaper', 'High contrast', 'Colorblind safe'].flatMap(theme => [
    { theme, isDark: false, viewport: MOBILE_VIEWPORT },
    { theme, isDark: true, viewport: theme === 'Classic' ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT }
]);

const visibleTestId = (page: Page, testId: string) => page.locator(`[data-testid="${testId}"]:visible`).first();

const applySettings = async (page: Page, capture: CaptureInterface): Promise<void> => {
    await page.getByText('Settings', { exact: true }).filter({ visible: true }).first().click();
    await visibleTestId(page, 'SettingsScreenSelectors.ThemeOption').click();
    await page.getByText(capture.theme, { exact: true }).filter({ visible: true }).first().click({ force: true });
    await visibleTestId(page, 'HeaderBackButtonSelectors.Root').click();

    if (capture.isDark) {
        await visibleTestId(page, 'SettingsScreenSelectors.DarkModeSwitch').click();
    }

    await page.getByText('Play', { exact: true }).filter({ visible: true }).first().click();
};

const readPuzzle = async (page: Page): Promise<string> => {
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, cell) =>
        visibleTestId(page, `CellSelectors.Cell.${Math.floor(cell / GRID_SIZE)}-${cell % GRID_SIZE}`).innerText()
    );

    return (await Promise.all(cells)).map(text => (/^[1-9]$/u.test(text.trim()) ? text.trim() : '.')).join('');
};

const captureBoard = async (browser: Browser, capture: CaptureInterface): Promise<void> => {
    const context = await browser.newContext({ viewport: capture.viewport, locale: 'en-US', deviceScaleFactor: 1 });
    const page = await context.newPage();

    await page.goto(`${APP_URL}/play`);
    await visibleTestId(page, 'HomeScreenSelectors.Root').waitFor({ timeout: SCREEN_TIMEOUT_MILLISECONDS });
    await applySettings(page, capture);
    await visibleTestId(page, 'HomeScreenSelectors.StartButton').click();
    await visibleTestId(page, 'CellSelectors.Cell.8-8').waitFor({ timeout: SCREEN_TIMEOUT_MILLISECONDS });
    await page.mouse.click(1, 1);

    const puzzle = await readPuzzle(page);
    const image = await page.screenshot({ type: 'jpeg', quality: JPEG_QUALITY });
    const mode = capture.isDark ? 'dark' : 'light';

    writeFixture(`app-${capture.theme.toLowerCase().replaceAll(' ', '-')}-${mode}-${capture.viewport.width}.jpg`, image, puzzle);
    await context.close();
};

const browser = await chromium.launch();

for (const capture of captures) {
    await captureBoard(browser, capture);
    console.log(`Captured ${capture.theme} ${capture.isDark ? 'dark' : 'light'}`);
}

await browser.close();
