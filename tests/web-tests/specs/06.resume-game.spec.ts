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

const parseTimerSeconds = (timerText: string): number => {
    const [minutesText, secondsText] = timerText.split(':');

    return Number(minutesText) * 60 + Number(secondsText);
};

test('pauses the timer in settings and resumes the persisted game after reload', async ({ page }) => {
    const initialTime = new Date('2026-01-01T00:00:00Z');
    await page.clock.install({ time: initialTime });
    await launchHome(page);
    await startNewGame(page);

    const timerLocator = page.getByTestId(GameScreenSelectors.Time);
    const pausedText = await timerLocator.textContent();
    const pausedSeconds = parseTimerSeconds(pausedText ?? '0:00');

    await page.getByTestId(GameScreenSelectors.SettingsButton).click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();
    await page.clock.runFor(settingsStayMilliseconds);

    await page.getByTestId(HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    const returnedText = await timerLocator.textContent();
    const returnedSeconds = parseTimerSeconds(returnedText ?? '0:00');
    expect(returnedSeconds - pausedSeconds).toBeLessThanOrEqual(1);

    await page.clock.runFor(timerAdvanceWaitMilliseconds);
    await expect.poll(async () => parseTimerSeconds((await timerLocator.textContent()) ?? '0:00')).toBeGreaterThan(returnedSeconds);
    const advancedText = await timerLocator.textContent();
    const advancedSeconds = parseTimerSeconds(advancedText ?? '0:00');

    expect(advancedSeconds).toBeGreaterThan(returnedSeconds);

    await page.goto('/');
    await expect(page.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();

    await page.getByTestId(HomeScreenSelectors.ResumeButton).click();
    await expect(page.getByTestId(GameScreenSelectors.Root)).toBeVisible();

    const resumedText = await timerLocator.textContent();
    const resumedSeconds = parseTimerSeconds(resumedText ?? '0:00');

    expect(resumedSeconds).toBeGreaterThanOrEqual(advancedSeconds);
});
