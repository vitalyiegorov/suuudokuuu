import { expect, test } from '@playwright/test';
import { GameScreenSelectors, HomeScreenSelectors, ImportScreenSelectors, PauseScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

import type { Page } from '@playwright/test';

const uniquePuzzle = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const uniquePuzzleLink = `https://www.sudokuwiki.org/sudoku.htm?bd=${uniquePuzzle}`;
const cellsAfterFirst = 80;
const uniqueStatus = 'Exactly one solution · SE 2.3 · Newbie';
const gameScreenTimeoutMilliseconds = 15000;
const pauseScreenTimeoutMilliseconds = 10000;

const openImportFromPlay = async (page: Page): Promise<void> => {
    await launchHome(page);
    await getVisibleByTestId(page, HomeScreenSelectors.ImportLink).click();
    await expect(page.getByTestId(ImportScreenSelectors.Root)).toBeVisible();
};

const tapCellValue = async (page: Page, cell: string, value: number): Promise<void> => {
    await page.getByTestId(`${ImportScreenSelectors.Cell}.${cell}`).click();
    await page.getByTestId(`${ImportScreenSelectors.PadValue}.${value}`).click();
};

test('imports a pasted puzzle link from the Play tab and plays it with its rating', async ({ page }) => {
    await openImportFromPlay(page);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('Paste a puzzle or open a link');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();

    await page.getByTestId(ImportScreenSelectors.Input).fill(uniquePuzzleLink);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus);
    await expect(page.getByTestId(ImportScreenSelectors.ClueCount)).toHaveText('32 clues');

    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: pauseScreenTimeoutMilliseconds });
    await bringAppToForeground(page);
    await expect(page.getByTestId(PauseScreenSelectors.DetailsValue)).toHaveText(/Newbie · 2\.3/u);

    await quitCurrentGame(page, PauseScreenSelectors.QuitButton);
});

test('corrects cells on the board and names conflicts and ambiguous puzzles', async ({ page }) => {
    await openImportFromPlay(page);

    await tapCellValue(page, '0-0', 5);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('More than one solution');

    await tapCellValue(page, '0-1', 5);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('These cells conflict');
    await expect(page.getByTestId(`${ImportScreenSelectors.Cell}.0-1`)).toHaveAccessibleName('Row 1, column 2, 5, wrong');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();

    await page.getByTestId(ImportScreenSelectors.ClearButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('More than one solution');
    await expect(page.getByTestId(ImportScreenSelectors.Input)).toHaveValue(`5${'.'.repeat(cellsAfterFirst)}`);
});

test('fills the input from a paste anywhere on the screen and from the Paste button', async ({ context, page }) => {
    await openImportFromPlay(page);

    await page.evaluate(
        text => {
            const clipboardData = new DataTransfer();

            clipboardData.setData('text/plain', text);
            document.body.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, clipboardData }));
        },
        `1${'0'.repeat(cellsAfterFirst)}`
    );
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('More than one solution');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(text => window.navigator.clipboard.writeText(text), uniquePuzzle);
    await page.getByTestId(ImportScreenSelectors.PasteButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
});

test('opens a puzzle from an import link', async ({ page }) => {
    await page.goto(`/import?puzzle=${uniquePuzzle}`);

    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus, { timeout: gameScreenTimeoutMilliseconds });
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();

    await page.getByTestId(ImportScreenSelectors.CancelButton).click();
    await expect(getVisibleByTestId(page, HomeScreenSelectors.Root)).toBeVisible();
});
