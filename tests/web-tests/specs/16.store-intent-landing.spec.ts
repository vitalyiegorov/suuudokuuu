import { expect, test } from '@playwright/test';
import {
    ChallengeModeSwitchSelectors,
    HomeScreenIntentSpotlightSelectors,
    HomeScreenSelectors,
    RatingExplainerSelectors
} from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { pushStackRoute } from '../src/utils/push-stack-route.util';
import { startNewGame } from '../src/utils/start-new-game.util';

test('an intent arriving over a scrolled Home brings the spotlight into view', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 667 });
    await launchHome(page);
    const openIntentOverHome = async () => {
        await page.getByTestId(HomeScreenSelectors.Root).evaluate(homeScreen => {
            homeScreen.scrollTop = homeScreen.scrollHeight;
        });
        await pushStackRoute(page, HomeScreenSelectors.Root, 'start/[intent]', { intent: 'expert' });
    };
    await openIntentOverHome();
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).toBeVisible();
    await expect.poll(() => page.getByTestId(HomeScreenSelectors.Root).evaluate(homeScreen => homeScreen.scrollTop)).toBe(0);
    await openIntentOverHome();
    await expect.poll(() => page.getByTestId(HomeScreenSelectors.Root).evaluate(homeScreen => homeScreen.scrollTop)).toBe(0);
});

test('the techniques landing keeps Start above the tab bar on a small phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 667 });
    await page.goto('/start/techniques');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).toBeVisible();
    const startButtonBottom = await page
        .getByTestId(HomeScreenSelectors.StartButton)
        .evaluate(element => element.getBoundingClientRect().bottom);
    const tabBarTop = await page.getByRole('tab', { name: 'Play', exact: true }).evaluate(element => element.getBoundingClientRect().top);

    expect(startButtonBottom).toBeLessThan(tabBarTop);
});

test('expert link applies Nightmare and Standard, then dismisses without changing setup', async ({ page }) => {
    await page.goto('/start/expert');
    const spotlight = page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT);
    await expect(spotlight).toBeVisible();
    await expect(spotlight.getByText('Ready for a real challenge')).toBeVisible();
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Nightmare • Standard');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).not.toContainText('Challenge');
    await page.getByTestId(HomeScreenIntentSpotlightSelectors.DISMISS).click();
    await expect(spotlight).not.toBeVisible();
    await expect(page).not.toHaveURL(/intent=/u);
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Nightmare • Standard');
});

test('quiet link disables challenge mode and persists Easy with Relaxed mistakes', async ({ page }) => {
    await launchHome(page);
    await page.getByTestId(ChallengeModeSwitchSelectors.Root).click();
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Challenge');
    await page.goto('/start/quiet');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).toBeVisible();
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Easy • Relaxed');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).not.toContainText('Challenge');
    await page.goto('/');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Easy • Relaxed');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).not.toBeVisible();
});

test('techniques link offers the rating explainer and finished-game replay guidance', async ({ page }) => {
    await page.goto('/start/techniques');
    const spotlight = page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT);
    await expect(spotlight).toBeVisible();
    await expect(spotlight).toContainText('Replay finished puzzles move by move from History');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Hard • Standard');
    await page.getByTestId(HomeScreenIntentSpotlightSelectors.RATING_LINK).click();
    await expect(page).toHaveURL(/\/rating-explainer\//u);
    await expect(page.getByTestId(RatingExplainerSelectors.Root)).toBeVisible();
});

test('unknown and repeated intent params leave the saved setup unchanged', async ({ page }) => {
    await page.goto('/start/quiet');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Easy • Relaxed');
    await page.goto('/start/unknown');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Easy • Relaxed');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).not.toBeVisible();
    await page.goto('/?intent=expert&intent=quiet');
    await expect(page.getByTestId(HomeScreenSelectors.StartButton)).toContainText('Easy • Relaxed');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).not.toBeVisible();
});

test('an intent link preserves an existing run and Start still asks before replacing it', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);
    await page.goto('/start/expert');
    await expect(page.getByTestId(HomeScreenIntentSpotlightSelectors.ROOT)).toBeVisible();
    await expect(page.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();
    page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Stop current run?');
        await dialog.dismiss();
    });
    await page.getByTestId(HomeScreenSelectors.StartButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();
});
