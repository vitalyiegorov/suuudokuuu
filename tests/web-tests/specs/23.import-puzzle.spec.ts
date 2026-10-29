import { expect, test } from '@playwright/test';
import {
    GameScreenSelectors,
    HomeScreenSelectors,
    ImportScreenSelectors,
    PauseScreenSelectors,
    WinnerScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';
import { cellTestId } from '../src/utils/test-id.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

import type { BrowserContext, Page } from '@playwright/test';

const uniquePuzzle = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const uniquePuzzleLink = `https://www.sudokuwiki.org/sudoku.htm?bd=${uniquePuzzle}`;
const sheetBackdropPosition = { x: 10, y: 10 };
const emptyStatus = 'Paste a puzzle or tap a cell to type it';
const uniqueStatus = 'One solution · Newbie · SE 2.3';
const singleClueStatus = '1 clue · more than one solution';
const gameScreenTimeoutMilliseconds = 15000;
const pauseScreenTimeoutMilliseconds = 10000;

const openImportFromPlay = async (page: Page): Promise<void> => {
    await launchHome(page);
    await getVisibleByTestId(page, HomeScreenSelectors.ImportLink).click();
    await expect(page.getByTestId(ImportScreenSelectors.Root)).toBeVisible();
};

const writeClipboard = async (context: BrowserContext, page: Page, text: string): Promise<void> => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(clipboardText => window.navigator.clipboard.writeText(clipboardText), text);
};

const cell = (page: Page, cellKey: string) => page.getByTestId(`${ImportScreenSelectors.Cell}.${cellKey}`);

test('pastes a puzzle link anywhere on the sheet', async ({ context, page }) => {
    await openImportFromPlay(page);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(emptyStatus);
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeDisabled();

    await writeClipboard(context, page, uniquePuzzleLink);
    await page.keyboard.press('ControlOrMeta+V');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
});

test('types on the board with the pad and keyboard, names conflicts and closes from the backdrop', async ({ page }) => {
    await openImportFromPlay(page);

    await cell(page, '0-0').click();
    await page.keyboard.press('ControlOrMeta+5');
    await expect(cell(page, '0-0')).toHaveAccessibleName('Row 1, column 1, empty');
    await page.getByTestId(`${ImportScreenSelectors.PadValue}.5`).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(singleClueStatus);

    await page.keyboard.press('5');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('Two 5s in row 1');
    await expect(cell(page, '0-1')).toHaveAccessibleName('Row 1, column 2, 5, wrong');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Backspace');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(singleClueStatus);
    await expect(cell(page, '0-0')).toHaveAccessibleName('Row 1, column 1, 5');

    await page.getByTestId(ImportScreenSelectors.ResetButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(emptyStatus);
    await expect(page.getByTestId(ImportScreenSelectors.PasteButton)).toBeVisible();

    await page.getByLabel('Close', { exact: true }).click({ position: sheetBackdropPosition });
    await expect(getVisibleByTestId(page, HomeScreenSelectors.Root)).toBeVisible();
});

test('reads the clipboard from the Paste puzzle button and reports text that is not a puzzle', async ({ context, page }) => {
    await openImportFromPlay(page);

    await writeClipboard(context, page, 'not a sudoku');
    await page.getByTestId(ImportScreenSelectors.PasteButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('No puzzle found on the clipboard');

    await writeClipboard(context, page, uniquePuzzle);
    await page.getByTestId(ImportScreenSelectors.PasteButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
});

test('opens an import link and asks before it replaces a game in progress', async ({ page }) => {
    const playButton = page.getByTestId(ImportScreenSelectors.PlayButton);

    await page.goto(`/import?puzzle=${uniquePuzzle}`);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus, { timeout: gameScreenTimeoutMilliseconds });
    await playButton.click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: pauseScreenTimeoutMilliseconds });
    await bringAppToForeground(page);
    await expect(page.getByTestId(PauseScreenSelectors.DetailsValue)).toHaveText(/Newbie · 2\.3/u);

    await page.goto(`/import?puzzle=${uniquePuzzle}`);
    await expect(playButton).toBeEnabled({ timeout: gameScreenTimeoutMilliseconds });

    const dismissedDialog = page.waitForEvent('dialog');
    page.once('dialog', dialog => void dialog.dismiss());
    await playButton.click();
    expect((await dismissedDialog).message()).toContain('Stop current run?');
    await expect(page.getByTestId(ImportScreenSelectors.Root)).toBeVisible();

    page.once('dialog', dialog => void dialog.accept());
    await playButton.click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await quitCurrentGame(page);
});

test('rejects a completed grid and lets its one-blank control finish', async ({ page }) => {
    const solution = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

    await page.goto(`/import?puzzle=${solution}`);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('This puzzle is already complete');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();
    await cell(page, '8-8').click();
    await page.keyboard.press('Backspace');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await page.getByTestId(cellTestId(8, 8)).click();
    await page.keyboard.press('9');
    await expect(page.getByTestId(WinnerScreenSelectors.Root)).toBeVisible();
});

test('keeps the full assessment above Play at twice the text size', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`/import?puzzle=${uniquePuzzle}`);
    const status = page.getByTestId(ImportScreenSelectors.Status);

    await expect(status).toHaveText(uniqueStatus);
    await page.addStyleTag({
        content: `html { font-size: 200%; } [data-testid="${ImportScreenSelectors.Status}"] div { font-size: 1rem !important; }`
    });
    await expect
        .poll(() =>
            status.evaluate(element => {
                const text = element.querySelector('[dir="auto"]');

                return text instanceof HTMLElement && text.scrollHeight <= element.clientHeight && text.scrollHeight <= text.clientHeight;
            })
        )
        .toBe(true);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeInViewport({ ratio: 1 });
});
