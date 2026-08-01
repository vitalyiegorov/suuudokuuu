import { expect, test } from '@playwright/test';
import {
    GameScreenSelectors,
    HeaderBackButtonSelectors,
    HomeScreenSelectors,
    SettingsScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

const settingsStayMilliseconds = 4000;
const timerAdvanceWaitMilliseconds = 2500;
const minimumObservedPauseSeconds = 3;

const parseTimerSeconds = (timerText: string): number => {
    const [minutesText, secondsText] = timerText.split(':');

    return Number(minutesText) * 60 + Number(secondsText);
};

test('pauses the timer in settings and resumes the persisted game after reload', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    const timerLocator = page.getByTestId(GameScreenSelectors.Time);
    const pausedText = await timerLocator.textContent();
    const pausedSeconds = parseTimerSeconds(pausedText ?? '0:00');
    const pauseStartedAt = Date.now();

    await page.getByTestId(GameScreenSelectors.SettingsButton).click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();
    await page.waitForTimeout(settingsStayMilliseconds);

    await page.getByTestId(HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    const returnedText = await timerLocator.textContent();
    const returnedSeconds = parseTimerSeconds(returnedText ?? '0:00');
    const wallElapsedSeconds = (Date.now() - pauseStartedAt) / 1000;

    expect(wallElapsedSeconds - (returnedSeconds - pausedSeconds)).toBeGreaterThanOrEqual(minimumObservedPauseSeconds);

    await page.waitForTimeout(timerAdvanceWaitMilliseconds);
    const advancedText = await timerLocator.textContent();
    const advancedSeconds = parseTimerSeconds(advancedText ?? '0:00');

    expect(advancedSeconds).toBeGreaterThan(returnedSeconds);

    await page.reload();
    await page.goto('/');
    await expect(page.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();

    await page.getByTestId(HomeScreenSelectors.ResumeButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    const resumedText = await timerLocator.textContent();
    const resumedSeconds = parseTimerSeconds(resumedText ?? '0:00');

    expect(resumedSeconds).toBeGreaterThanOrEqual(advancedSeconds);
});
