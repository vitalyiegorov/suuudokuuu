import { expect, test } from '@playwright/test';
import {
    DailyNextPuzzleBarSelectors,
    DailyRecentSolvesSelectors,
    DailyScreenSelectors,
    DailyShareButtonSelectors,
    DailyStreakHeroSelectors,
    DailyTodayResultSelectors,
    DailyTodayResultStatsSelectors,
    DailyTodaySummarySelectors,
    DailyWeekDaySelectors,
    GameScreenSelectors,
    WinnerScreenSelectors
} from '@suuudokuuu/app/src/selectors';
import { forgeDailyPuzzle, getDailyDayNumber } from '@suuudokuuu/puzzle-forge';

import { launchHome } from '../src/utils/launch-home.util';
import { cellTestId } from '../src/utils/test-id.util';

import type { Page } from '@playwright/test';

const todayDateString = '2026-10-05';
const todayDayNumber = getDailyDayNumber(todayDateString);
const gameScreenTimeoutMilliseconds = 15000;
const winnerScreenTimeoutMilliseconds = 15000;
const solveTestTimeoutMilliseconds = 120000;

const openDailyTab = async (page: Page): Promise<void> => {
    await page.getByText('Daily', { exact: true }).click();
    await expect(page.getByTestId(DailyScreenSelectors.Root)).toBeVisible();
};

const solveTodaysDaily = async (page: Page): Promise<void> => {
    const { sudoku } = forgeDailyPuzzle(todayDateString);
    const blankCells = sudoku.Field.flat().filter(cell => sudoku.isBlankCell(cell));

    await page.getByTestId(DailyScreenSelectors.ActionButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible({ timeout: gameScreenTimeoutMilliseconds });

    for (const cell of blankCells) {
        await page.getByTestId(cellTestId(cell.y, cell.x)).click();
        await page.keyboard.press(String(sudoku.getCorrectValue(cell)));
    }

    await expect(page.getByTestId(WinnerScreenSelectors.Root)).toBeVisible({ timeout: winnerScreenTimeoutMilliseconds });
};

test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date(`${todayDateString}T09:30:00.000Z`));
});

test('offers today’s puzzle on a fresh profile', async ({ page }) => {
    await launchHome(page);
    await openDailyTab(page);

    const dailyScreen = page.getByTestId(DailyScreenSelectors.Root);

    await expect(dailyScreen.getByTestId(DailyStreakHeroSelectors.Streak)).toHaveText('0');
    await expect(dailyScreen.getByTestId(`${DailyWeekDaySelectors.Root}.${todayDayNumber}`)).toHaveAttribute('aria-label', /Today$/u);
    await expect(dailyScreen.getByTestId(`${DailyWeekDaySelectors.Root}.${todayDayNumber + 1}`)).toHaveAttribute(
        'aria-label',
        /Upcoming$/u
    );
    await expect(dailyScreen.getByTestId(DailyTodaySummarySelectors.Root)).toBeVisible();
    await expect(dailyScreen.getByTestId(DailyRecentSolvesSelectors.Empty)).toBeVisible();
    await expect(dailyScreen.getByTestId(DailyScreenSelectors.ActionButton)).toHaveText('Play today');
});

test('solving today’s puzzle records its result and swaps the call to action for the next puzzle countdown', async ({ page }) => {
    test.setTimeout(solveTestTimeoutMilliseconds);
    await launchHome(page);
    await openDailyTab(page);
    await solveTodaysDaily(page);

    await page.getByTestId(WinnerScreenSelectors.HomeButton).click();
    await openDailyTab(page);

    const dailyScreen = page.getByTestId(DailyScreenSelectors.Root);

    await expect(dailyScreen.getByTestId(DailyStreakHeroSelectors.Streak)).toHaveText('1');
    await expect(dailyScreen.getByTestId(`${DailyWeekDaySelectors.Root}.${todayDayNumber}`)).toHaveAttribute(
        'aria-label',
        /Solved today$/u
    );
    await expect(dailyScreen.getByTestId(DailyTodayResultSelectors.Root)).toBeVisible();
    await expect(dailyScreen.getByTestId(DailyTodayResultStatsSelectors.Mistakes)).toHaveText('0');
    await expect(dailyScreen.getByTestId(DailyTodayResultStatsSelectors.Time)).not.toBeEmpty();
    await expect(dailyScreen.getByTestId(DailyTodayResultStatsSelectors.Score)).not.toBeEmpty();
    await expect(dailyScreen.getByTestId(DailyNextPuzzleBarSelectors.Countdown)).toHaveText('New puzzle in 14 hr 30 min');
    await expect(dailyScreen.getByTestId(DailyShareButtonSelectors.Button)).toBeVisible();
    await expect(dailyScreen.getByTestId(DailyScreenSelectors.ActionButton)).toHaveCount(0);
});
