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

import type { BrowserContext, Locator, Page } from '@playwright/test';

const selectedCellSizeMin = 28;
const uniquePuzzle = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
const uniquePuzzleLink = `https://www.sudokuwiki.org/sudoku.htm?bd=${uniquePuzzle}`;
const sheetBackdropPosition = { x: 10, y: 10 };
const emptyStatus = 'No clues yet';
const fixtureDirectory = resolve(__dirname, '../../../packages/grid-vision/test/fixtures');
const photoPuzzle = '5...794.......8..7.7.3542.8..4..3579.3.4.1..2...7..3..9...4..6..5..8...3.68......';
const photoSolution = '581279436342618957679354218214863579735491682896725341923147865457986123168532794';
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

const expectHiddenControl = async (control: Locator): Promise<void> => {
    await expect
        .poll(() =>
            control.evaluate(element => {
                for (let ancestor: Element | null = element; ancestor !== null; ancestor = ancestor.parentElement) {
                    if (getComputedStyle(ancestor).opacity === '0') {
                        return true;
                    }
                }

                return false;
            })
        )
        .toBe(true);
    await expect.poll(() => control.evaluate(element => element.closest('[inert][aria-hidden="true"]') !== null)).toBe(true);
    await control.evaluate(element => {
        if (element instanceof HTMLElement) {
            element.focus();
        }
    });
    await expect(control).not.toBeFocused();
};

const expectPressTarget = async (control: Locator): Promise<void> => {
    await expect(control).toBeVisible();
    const bounds = await control.boundingBox();

    expect(bounds?.width).toBeGreaterThanOrEqual(minimumTouchTargetSize);
    expect(bounds?.height).toBeGreaterThanOrEqual(minimumTouchTargetSize);
};

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
    await expect(page.getByTestId(ImportScreenSelectors.Guidance)).toHaveText('Tap a cell, then a digit');
    for (const control of [
        ...Array.from({ length: 9 }, (_, index) => page.getByTestId(`${ImportScreenSelectors.PadValue}.${index + 1}`)),
        page.getByTestId(ImportScreenSelectors.ClearButton),
        page.getByTestId(ImportScreenSelectors.EntryToggleButton),
        page.getByTestId(ImportScreenSelectors.EntryActiveButton)
    ]) {
        await expectHiddenControl(control);
    }
    await cell(page, '0-0').click();
    await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeEnabled();
    await expectHiddenControl(page.getByTestId(ImportScreenSelectors.EntryToggleButton));
    await page.keyboard.press('ControlOrMeta+5');
    await expect(cell(page, '0-0')).toHaveAccessibleName('Row 1, column 1, empty');
    await page.getByTestId(`${ImportScreenSelectors.PadValue}.5`).click();
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText(singleClueStatus);
    await expectHiddenControl(page.getByTestId(ImportScreenSelectors.EntryToggleButton));

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
    await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Guidance)).toHaveText('1 entry kept · 1 didn’t match');
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
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText("Couldn't find a sudoku grid");
    await expect(page.getByTestId(ImportScreenSelectors.Guidance)).toHaveText('Try a closer, straighter photo');
    await expect(page.getByTestId(ImportScreenSelectors.Sources)).toBeVisible();
});

test('starts from printed clues when handwritten entries complete the puzzle', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'app-classic-light-390.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    for (const [index, digit] of Array.from(photoSolution).entries()) {
        if (photoPuzzle[index] === '.') {
            await cell(page, `${Math.floor(index / 9)}-${index % 9}`).click();
            await page.keyboard.press(digit);
        }
    }
    await expect(page.getByTestId(ImportScreenSelectors.Status)).toHaveText('This puzzle is already complete');
    await cell(page, '0-4').click();
    await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.Guidance)).toContainText(
        "Already solved on paper. You'll start from the printed clues."
    );
    await page.getByTestId(ImportScreenSelectors.PlayButton).click();
    await expect(page).toHaveURL(/\/game$/u);
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    await expect(page.getByTestId(cellTestId(0, 4))).toHaveAccessibleName('Row 1, column 5, empty');
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
    await expect(page.getByTestId(ImportScreenSelectors.Guidance)).toHaveText(/entries? kept/u);
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

test('reserves the clear slot and shows the kind of the selected handwritten entry', async ({ page }) => {
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
    await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).toHaveAccessibleName('Clue');
    await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).not.toBeChecked();
    await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toHaveAccessibleName('My entry');
    await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toBeChecked();
    await expect(page.getByTestId(ImportScreenSelectors.Root)).not.toContainText('0 didn’t match');
});

test('keeps the selected row and pad visible while typing at twice the text size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openImportFromPlay(page);
    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeVisible();
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeDisabled();
    const statusText = page.getByTestId(ImportScreenSelectors.Status).getByText(emptyStatus);
    const initialFontSize = await statusText.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
    await page.addStyleTag({ content: '[dir="auto"] { font-size: 200% !important; }' });
    await expect
        .poll(() => statusText.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize)))
        .toBeGreaterThan(initialFontSize);
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

test('keeps the selected row inside the desktop scroll viewport when it fits with the pad', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openImportFromPlay(page);
    await pickPhoto(page, 'handwritten-photo-01.jpg');
    await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
    const selectedCell = page.getByRole('button', { name: /Row 5,.*handwritten/u }).first();
    await selectedCell.click();
    await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).toBeVisible();
    await expect
        .poll(async () => {
            const selectedBounds = await selectedCell.boundingBox();
            const viewportBounds = await page.getByTestId(ImportScreenSelectors.Root).boundingBox();

            return (
                selectedBounds !== null &&
                viewportBounds !== null &&
                selectedBounds.x >= viewportBounds.x &&
                selectedBounds.y >= viewportBounds.y &&
                selectedBounds.x + selectedBounds.width <= viewportBounds.x + viewportBounds.width &&
                selectedBounds.y + selectedBounds.height <= viewportBounds.y + viewportBounds.height
            );
        })
        .toBe(true);
});

for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 }
]) {
    test(`keeps the selected entry, toggle and Play visible at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openImportFromPlay(page);
        await pickPhoto(page, 'handwritten-photo-01.jpg');
        await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
        if (viewport.width < viewport.height) {
            await page.addStyleTag({ content: '[dir="auto"] { font-size: 200% !important; }' });
        }
        const selectedCell = page.getByRole('button', { name: /Row 1,.*handwritten/u }).first();
        await selectedCell.click();
        await expect(selectedCell).toBeInViewport({ ratio: 1 });
        await expect.poll(async () => (await selectedCell.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(selectedCellSizeMin);
        await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeInViewport({ ratio: 1 });
        await expect(page.getByTestId(ImportScreenSelectors.EntryToggleButton)).toBeInViewport({ ratio: 1 });
        await expect
            .poll(async () => {
                const selected = await selectedCell.boundingBox();
                const toggle = await page.getByTestId(ImportScreenSelectors.EntryToggleButton).boundingBox();
                const play = await page.getByTestId(ImportScreenSelectors.PlayButton).boundingBox();
                const scroll = await page.getByTestId(ImportScreenSelectors.Root).boundingBox();

                return (
                    selected !== null &&
                    toggle !== null &&
                    play !== null &&
                    scroll !== null &&
                    selected.y >= scroll.y &&
                    selected.y + selected.height <= scroll.y + scroll.height &&
                    toggle.y >= scroll.y + scroll.height &&
                    toggle.y + toggle.height <= play.y
                );
            })
            .toBe(true);
    });
}

test('marks uncertain digits recognized from a photo for review', async ({ page }) => {
    await openImportFromPlay(page);
    await pickPhoto(page, 'handwritten-photo-03.jpg');
    const reviewStatus = page.getByTestId(ImportScreenSelectors.Status);

    const uncertainCell = page.getByRole('button', { name: /check this digit/u }).first();

    await expect(uncertainCell).toBeVisible();
    await uncertainCell.click();
    await expect(page.getByTestId(ImportScreenSelectors.Legend)).toContainText('Check');
    await uncertainCell.click();
    await expect(reviewStatus).toContainText('digits to check');
    const uncertainCellCount = Number.parseInt((await reviewStatus.textContent()) ?? '', 10);

    await page.keyboard.press('Backspace');
    await expect(reviewStatus).toHaveText(new RegExp(`^${uncertainCellCount - 1} digits? to check`, 'u'));
    await page.keyboard.press('Backspace');
    await expect(reviewStatus).toHaveText(new RegExp(`^${uncertainCellCount - 2} digits? to check`, 'u'));
});

for (const { width, height, textScale } of [
    { width: 320, height: 568, textScale: 1 },
    { width: 390, height: 844, textScale: 1 },
    { width: 1280, height: 800, textScale: 1 },
    { width: 390, height: 844, textScale: 2 }
]) {
    test(`keeps the board, status, controls, Play and sheet still while reviewing a scan at ${width}x${height} and ${textScale}x text`, async ({
        page
    }) => {
        const [file, puzzle, handwriting] =
            readFileSync(resolve(fixtureDirectory, 'manifest.txt'), 'utf8')
                .split('\n')
                .find(line => line.startsWith('handwritten-photo-01.jpg '))
                ?.split(' ') ?? [];
        const cellAt = (index: number) => cell(page, `${Math.floor(index / 9)}-${index % 9}`);
        const marks = Array.from(handwriting);
        const emptyCell = cellAt(puzzle.indexOf('.'));
        const clueCell = cellAt(marks.findIndex((mark, index) => mark !== 'h' && puzzle[index] !== '.'));
        const entryCell = cellAt(marks.indexOf('h'));
        const status = page.getByTestId(ImportScreenSelectors.Status);
        const play = page.getByTestId(ImportScreenSelectors.PlayButton);
        const stillElements = [
            cell(page, '0-0').locator('../../..'),
            status.locator('..'),
            play.locator('../div').first(),
            play.locator('../..'),
            cell(page, '0-0'),
            cell(page, '8-8'),
            page.getByTestId(`${ImportScreenSelectors.PadValue}.1`),
            page.getByTestId(ImportScreenSelectors.ClearButton),
            page.getByTestId(ImportScreenSelectors.PlayButton)
        ];
        const readStatusFontSize = () =>
            status.locator('[dir="auto"]').evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize));
        const readSettledBoxes = async () => {
            await expect(status).not.toHaveText('Checking…');
            await page.evaluate(
                () =>
                    new Promise<void>(resolve => {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                resolve();
                            });
                        });
                    })
            );

            return Promise.all(stillElements.map(element => element.boundingBox()));
        };

        await page.setViewportSize({ width, height });
        await openImportFromPlay(page);
        await pickPhoto(page, file);
        await expect(page.getByTestId(ImportScreenSelectors.PlayButton)).toBeEnabled();
        if (textScale > 1) {
            const fontSize = await readStatusFontSize();
            await page.addStyleTag({ content: `[dir="auto"] { font-size: ${textScale * 100}% !important; }` });
            await expect.poll(readStatusFontSize).toBeGreaterThan(fontSize);
        }
        await entryCell.click();
        await entryCell.click();
        await expect(page.getByTestId(ImportScreenSelectors.Legend)).toContainText('Clue');
        await expect(page.getByTestId(ImportScreenSelectors.Legend)).toContainText('My entry');
        await expect(page.getByTestId(ImportScreenSelectors.Legend)).toContainText('Tap a cell to change it');
        await expectHiddenControl(page.getByTestId(ImportScreenSelectors.ClearButton));
        const boxes = await readSettledBoxes();

        expect(boxes).not.toContain(null);
        for (const element of stillElements) {
            await expect(element).toBeInViewport({ ratio: 1 });
        }
        await emptyCell.click();
        await expect(page.getByTestId(ImportScreenSelectors.Legend)).toHaveCount(0);
        await expect(page.getByTestId(ImportScreenSelectors.ClearButton)).toBeEnabled();
        await expectHiddenControl(page.getByTestId(ImportScreenSelectors.EntryToggleButton));
        for (const value of Array.from({ length: 9 }, (_, index) => index + 1)) {
            await expectPressTarget(page.getByTestId(`${ImportScreenSelectors.PadValue}.${value}`));
        }
        await expectPressTarget(page.getByTestId(ImportScreenSelectors.ClearButton));
        await expectPressTarget(page.getByTestId(ImportScreenSelectors.ResetButton));
        expect(await readSettledBoxes()).toEqual(boxes);
        await clueCell.click();
        await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toHaveAccessibleName('Clue');
        await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toBeChecked();
        await expectPressTarget(page.getByTestId(ImportScreenSelectors.EntryActiveButton));
        await expectPressTarget(page.getByTestId(ImportScreenSelectors.EntryToggleButton));
        expect(await readSettledBoxes()).toEqual(boxes);
        await entryCell.click();
        await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toHaveAccessibleName('My entry');
        expect(await readSettledBoxes()).toEqual(boxes);
        await page.getByTestId(ImportScreenSelectors.EntryToggleButton).click();
        await expect(page.getByTestId(ImportScreenSelectors.EntryActiveButton)).toHaveAccessibleName('Clue');
        expect(await readSettledBoxes()).toEqual(boxes);
        await page.getByTestId(`${ImportScreenSelectors.PadValue}.1`).click();
        await expect(entryCell).toHaveText('1');
        expect(await readSettledBoxes()).toEqual(boxes);
        await entryCell.click();
        await expectHiddenControl(page.getByTestId(ImportScreenSelectors.ClearButton));
        await expectHiddenControl(page.getByTestId(ImportScreenSelectors.EntryToggleButton));
        await expect(page.getByTestId(ImportScreenSelectors.Legend)).toBeVisible();
        expect(await readSettledBoxes()).toEqual(boxes);
    });
}

const recordBoardFrames = (selectors: typeof ImportScreenSelectors) => {
    const frames: string[] = [];
    let firstFrameTime: number | undefined;
    const recordFrame = (time: number) => {
        const find = (testId: string) => document.querySelector(`[data-testid="${testId}"]`);
        const firstCell = find(`${selectors.Cell}.0-0`);
        const status = find(selectors.Status);
        const play = find(selectors.PlayButton);
        if (firstCell !== null && firstCell.getClientRects().length > 0 && status !== null && play !== null) {
            firstFrameTime ??= time;
            frames.push(
                JSON.stringify(
                    [
                        firstCell.parentElement?.parentElement?.parentElement,
                        find(selectors.Title)?.parentElement,
                        status.parentElement,
                        play.parentElement?.firstElementChild,
                        play
                    ].map(element => {
                        const bounds = element?.getBoundingClientRect();

                        return { x: bounds?.x, y: bounds?.y, width: bounds?.width, height: bounds?.height };
                    })
                )
            );
        }
        if (firstFrameTime !== undefined && time - firstFrameTime >= 500) {
            document.documentElement.dataset['importFrames'] = JSON.stringify(frames);
        } else {
            requestAnimationFrame(recordFrame);
        }
    };
    requestAnimationFrame(recordFrame);
};

for (const viewport of [
    { width: 375, height: 667 },
    { width: 1280, height: 800 }
]) {
    for (const source of ['type', 'paste', 'scan', 'link']) {
        test(`settles every board rectangle on its first frame from ${source} at ${viewport.width}x${viewport.height}`, async ({
            context,
            page
        }) => {
            await page.setViewportSize(viewport);
            if (source === 'link') {
                await page.addInitScript(recordBoardFrames, ImportScreenSelectors);
                await page.goto(`/import?puzzle=${uniquePuzzle}`);
            } else {
                await openImportFromPlay(page);
                await page.evaluate(recordBoardFrames, ImportScreenSelectors);
                if (source === 'type') {
                    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
                } else if (source === 'paste') {
                    await writeClipboard(context, page, uniquePuzzle);
                    await page.getByTestId(ImportScreenSelectors.PasteButton).click();
                } else {
                    await pickPhoto(page, 'handwritten-photo-01.jpg');
                }
            }
            await expect.poll(() => page.evaluate(() => document.documentElement.dataset['importFrames'])).toBeDefined();
            const frames: unknown = await page.evaluate((): unknown =>
                JSON.parse(document.documentElement.dataset['importFrames'] ?? '[]')
            );
            expect(Array.isArray(frames)).toBe(true);
            if (Array.isArray(frames)) {
                expect(frames.length).toBeGreaterThan(1);
                expect([...new Set(frames)]).toHaveLength(1);
            }
        });
    }
}

test('tabs from Clear to Play past inert editing controls on an unselected board', async ({ context, page }) => {
    await openImportFromPlay(page);
    await page.getByTestId(ImportScreenSelectors.TypeButton).click();
    await writeClipboard(context, page, uniquePuzzle);
    await page.keyboard.press('ControlOrMeta+V');
    const play = page.getByTestId(ImportScreenSelectors.PlayButton);
    await expect(play).toBeEnabled();
    await expectHiddenControl(page.getByTestId(ImportScreenSelectors.EntryActiveButton));
    await page.getByTestId(ImportScreenSelectors.ResetButton).focus();
    await page.keyboard.press('Tab');
    await expect(play).toBeFocused();
});
