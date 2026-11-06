import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from '@playwright/test';
import {
    GameScreenSelectors,
    HomeScreenSelectors,
    ImportScreenSelectors,
    PauseScreenSelectors,
    UndoButtonSelectors,
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
const emptyStatus = 'Tap a cell to type it';
const fixtureDirectory = resolve(__dirname, '../../../packages/grid-vision/test/fixtures');
const photoPuzzle = '5...794.......8..7.7.3542.8..4..3579.3.4.1..2...7..3..9...4..6..5..8...3.68......';
const uniqueStatus = 'One solution · Newbie · SE 2.3';
const singleClueStatus = '1 clue · more than one solution';
const gameScreenTimeoutMilliseconds = 15000;
const pauseScreenTimeoutMilliseconds = 10000;
const minimumTouchTargetSize = 44;

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
    await expect(page.getByTestId(ImportScreenSelectors.Sources)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.ScanButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.PhotosButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.PasteButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.TypeButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeHidden();

    await writeClipboard(context, page, uniquePuzzleLink);
    await page.keyboard.press('ControlOrMeta+V');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(uniqueStatus);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
});

test('types on the board with the pad and keyboard, names conflicts and closes from the backdrop', async ({ page }) => {
    await openImportFromPlay(page);

    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(emptyStatus);
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
    await expect(page.getByTestId(ImportScreenSelectors.Sources)).toBeVisible();
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

for (const viewport of [
    { width: 1280, height: 800 },
    { width: 375, height: 667 }
]) {
    test(`contains keyboard focus and restores it when closed at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await launchHome(page);
        const importLink = getVisibleByTestId(page, HomeScreenSelectors.ImportLink);

        await importLink.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Import a puzzle', exact: true });

        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute('aria-modal', 'true');
        await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
        for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
            await page.keyboard.press(key);
            await expect.poll(() => dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
        }
        await page.keyboard.press('Escape');
        await expect(page.getByTestId(ImportScreenSelectors.Root)).toBeHidden();
        await expect(importLink).toBeFocused();
    });
}

const pickPhoto = async (page: Page, name: string): Promise<void> => {
    const fileChooser = page.waitForEvent('filechooser');
    await page.getByTestId(ImportScreenSelectors.PhotosButton).click();
    await (await fileChooser).setFiles(resolve(fixtureDirectory, name));
};

const expectPhotoDigits = async (page: Page): Promise<void> => {
    for (const [index, digit] of Array.from(photoPuzzle).entries()) {
        if (digit !== '.') {
            await expect(cell(page, `${Math.floor(index / 9)}-${index % 9}`)).toHaveText(digit);
        }
    }
};

test('recognizes a photo and starts the puzzle', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'app-classic-light-390.jpg');
    await expectPhotoDigits(page);
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(/One solution/u);
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
});

test('recognizes an image pasted onto the sheet', async ({ page }) => {
    await openImportFromPlay(page);
    const image = readFileSync(resolve(fixtureDirectory, 'app-classic-light-390.jpg')).toString('base64');
    await page.evaluate(base64 => {
        const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0));
        const transfer = new DataTransfer();
        transfer.items.add(new File([bytes], 'puzzle.jpg', { type: 'image/jpeg' }));
        document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true }));
    }, image);
    await expectPhotoDigits(page);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
});

test('reviews handwritten digits from a photo', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'handwritten-photo-01.jpg');
    await expect(
        page
            .getByTestId(ImportScreenSelectors.Root)
            .getByRole('button', { name: /handwritten/u })
            .first()
    ).toBeVisible();
});

test('keeps matching handwritten entries, drops wrong entries and starts with no undo history', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'app-classic-light-390.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    await cell(page, '0-4').click();
    await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
    await expect(cell(page, '0-4')).toHaveAccessibleName(/7, handwritten/u);
    await cell(page, '0-6').click();
    await page.getByTestId(`${ImportScreenSelectors.PadValue}.2`).click();
    await cell(page, '0-6').click();
    await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(/1 didn’t match.*1 of your entries kept/u);
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(cellTestId(0, 4))).toHaveAccessibleName('Row 1, column 5, 7');
    await expect(page.getByTestId(cellTestId(0, 6))).toHaveAccessibleName('Row 1, column 7, empty');
    await expect(page.getByTestId(UndoButtonSelectors.Root)).toBeDisabled();
    await page.reload();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(cellTestId(0, 4))).toHaveAccessibleName('Row 1, column 5, 7');
    await expect(page.getByTestId(cellTestId(0, 6))).toHaveAccessibleName('Row 1, column 7, empty');
});

test('reports a photo without a grid and allows another source', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'no-grid-01.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText("Couldn't find a sudoku grid. Try a closer, straighter photo.");
    await expect(page.getByTestId(ImportScreenSelectors.Sources)).toBeVisible();
});

test('completes a run when its last digit is a matching handwritten entry', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'app-classic-light-390.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    await cell(page, '0-0').click();
    await page.keyboard.type('581279436342618957679354218214863579735491682896725341923147865457986123168532794');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('This puzzle is already complete');
    await cell(page, '0-4').click();
    await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(/1 of your entries kept/u);
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(WinnerScreenSelectors.Root)).toBeVisible();
});

test('rejecting pasted text interrupts recognition and restores the sources', async ({ page }) => {
    await openImportFromPlay(page);
    await page.clock.install({ time: new Date('2030-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2030-01-01T00:01:00Z'));
    await pickPhoto(page, 'app-classic-light-390.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('Reading the puzzle…');
    await page.evaluate(() => {
        const transfer = new DataTransfer();
        transfer.setData('text/plain', 'not a puzzle');
        document.dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true }));
    });
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('No puzzle found on the clipboard');
    await expect(page.getByTestId(ImportScreenSelectors.Sources)).toBeVisible();
});

test('plays and restores handwritten progress recognized from a photo', async ({ page }) => {
    const [file, puzzle, handwriting] =
        readFileSync(resolve(fixtureDirectory, 'manifest.txt'), 'utf8')
            .split('\n')
            .find(line => line.startsWith('handwritten-photo-01.jpg '))
            ?.split(' ') ?? [];
    await openImportFromPlay(page);
    await pickPhoto(page, file);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(/of your entries kept/u);
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    for (const [index, mark] of Array.from(handwriting).entries()) {
        if (mark === 'h') {
            await expect(page.getByTestId(cellTestId(Math.floor(index / 9), index % 9))).toHaveText(puzzle[index]);
        }
    }
    await expect(page.getByTestId(UndoButtonSelectors.Root)).toBeDisabled();
    await page.reload();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    for (const [index, mark] of Array.from(handwriting).entries()) {
        if (mark === 'h') {
            await expect(page.getByTestId(cellTestId(Math.floor(index / 9), index % 9))).toHaveText(puzzle[index]);
        }
    }
});

test('keeps a square board and scrolls the pad into view at 200% zoom', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/import?puzzle=${uniquePuzzle}`);
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    await page.addStyleTag({ content: 'html { zoom: 2; }' });
    const firstCell = cell(page, '0-0');
    await expect
        .poll(async () => {
            const bounds = await firstCell.boundingBox();

            return bounds !== null && bounds.width > 0 && Math.abs(bounds.width - bounds.height) < 1;
        })
        .toBe(true);
    await firstCell.click();
    await expect(page.getByTestId(`${ImportScreenSelectors.PadValue}.1`)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeInViewport({ ratio: 1 });
});

test('reserves the clear slot and reveals the handwritten entry toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openImportFromPlay(page);
    const titleBounds = await page.getByTestId(ImportScreenSelectors.Title).boundingBox();
    await expect(page.getByTestId(ImportScreenSelectors.ResetButton)).toBeHidden();
    await pickPhoto(page, 'handwritten-photo-01.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    expect(await page.getByTestId(ImportScreenSelectors.Title).boundingBox()).toEqual(titleBounds);
    await page
        .getByRole('button', { name: /handwritten/u })
        .first()
        .click();
    await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).toHaveAccessibleName('Make printed clue');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).not.toHaveText(/0 didn’t match/u);
});

test('keeps the selected row and pad visible while typing at twice the text size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openImportFromPlay(page);
    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();
    await page.addStyleTag({ content: '[dir="auto"] { font-size: 200% !important; }' });
    await cell(page, '0-0').click();
    await expect(cell(page, '0-0')).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeInViewport({ ratio: 1 });
    const firstKey = await page.getByTestId(`${ImportScreenSelectors.PadValue}.1`).boundingBox();
    const fifthKey = await page.getByTestId(`${ImportScreenSelectors.PadValue}.5`).boundingBox();
    const ninthKey = await page.getByTestId(`${ImportScreenSelectors.PadValue}.9`).boundingBox();
    const clearKey = await page.getByTestId(ImportScreenSelectors.ClearButton).boundingBox();

    expect(firstKey?.width).toBeGreaterThanOrEqual(minimumTouchTargetSize);
    expect(fifthKey?.y).toBe(firstKey?.y);
    expect(clearKey?.y).toBe(ninthKey?.y);
    expect(clearKey?.y).toBeGreaterThan(firstKey?.y ?? 0);
    await page.keyboard.press('1');
    await page.keyboard.press('1');
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('Two 1s in row 1');
    await expect(cell(page, '0-2')).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeInViewport({ ratio: 1 });
    await page.keyboard.press('ArrowUp');
    await expect(cell(page, '8-2')).toBeInViewport({ ratio: 1 });
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeInViewport({ ratio: 1 });
    await page.getByTestId(ImportScreenSelectors.ResetButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toHaveCount(0);
});

test('pins Play while typing, selecting a cell and loading a unique puzzle', async ({ context, page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openImportFromPlay(page);
    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
    const play = page.getByTestId(ImportScreenSelectors.PlayButton);
    await expect(play).toBeVisible();
    const typingBounds = await play.boundingBox();
    expect(typingBounds).not.toBeNull();
    await cell(page, '0-0').click();
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeInViewport({ ratio: 1 });
    expect((await play.boundingBox())?.y).toBe(typingBounds?.y);
    await writeClipboard(context, page, uniquePuzzle);
    await page.keyboard.press('ControlOrMeta+V');
    await expect(play).toBeEnabled();
    expect((await play.boundingBox())?.y).toBe(typingBounds?.y);
});
