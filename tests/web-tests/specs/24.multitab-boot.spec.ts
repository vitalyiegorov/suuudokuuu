import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    CompletedGameItemSelectors,
    GameScreenSelectors,
    HistoryDifficultySelectors,
    HomeScreenSelectors,
    SettingsOptionSheetSelectors,
    SettingsScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { winningSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { completeWinningSharedChallenge } from '../src/utils/complete-winning-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { startNewGame } from '../src/utils/start-new-game.util';

const bootTimeoutMilliseconds = 20000;

for (const browserApi of ['storage', 'locks'] as const) {
    test(`bounds stalled ${browserApi} startup`, async ({ page }) => {
        await page.addInitScript(api => {
            const target = api === 'storage' ? window.navigator.storage : window.navigator.locks;
            const method = api === 'storage' ? 'getDirectory' : 'request';

            Object.defineProperty(target, method, { value: () => Promise.withResolvers<unknown>().promise });
        }, browserApi);
        await page.goto('/play');
        await expect(page.getByRole('alert')).toHaveText('Unable to load your game', { timeout: bootTimeoutMilliseconds });
    });
}

test('keeps one owner and preserves settings, the current game and history across tab changes', async ({ context, page }) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, winningSharedChallengeEncodedConstant);
    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await startNewGame(page);
    const savedGrid = await page.getByTestId(/^CellSelectors\.Cell\./u).allTextContents();

    const secondPage = await context.newPage();
    await secondPage.goto('/play');
    await expect(secondPage.getByRole('alert')).toContainText('another tab');
    await secondPage.getByRole('button', { name: 'Try again' }).click();
    await expect(secondPage.getByRole('alert')).toContainText('another tab');
    await expect(secondPage.getByTestId(GameScreenSelectors.Root)).toHaveCount(0);

    await page.getByTestId(GameScreenSelectors.SettingsButton).click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();
    await page.getByTestId(SettingsScreenSelectors.CellSpacingOption).click();
    await page.getByTestId(SettingsOptionSheetSelectors.Root).getByText('Spacious', { exact: true }).click();
    await expect(page.getByTestId(SettingsOptionSheetSelectors.Root)).not.toBeVisible();
    await page.goto('/play');
    await expect(page.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();
    await page.close();

    await secondPage.getByRole('button', { name: 'Try again' }).click();
    await expect(secondPage.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();
    await secondPage.getByTestId(HomeScreenSelectors.ResumeButton).click();
    await expect(secondPage.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    expect(await secondPage.getByTestId(/^CellSelectors\.Cell\./u).allTextContents()).toEqual(savedGrid);
    await secondPage.getByTestId(GameScreenSelectors.SettingsButton).click();
    await expect(secondPage.getByTestId(SettingsScreenSelectors.CellSpacingOption)).toContainText('Spacious');
    await secondPage.goto('/play');
    await expect(secondPage.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await secondPage.getByText('Stats', { exact: true }).click();
    await secondPage.getByTestId(`${HistoryDifficultySelectors.Card}.Newbie`).click();
    await expect(secondPage.getByTestId(CompletedGameItemSelectors.ReplayButton)).toBeVisible();

    const returningPage = await context.newPage();
    await returningPage.goto('/play');
    await expect(returningPage.getByRole('alert')).toContainText('another tab');
    await secondPage.close();
    await returningPage.getByRole('button', { name: 'Try again' }).click();
    await expect(returningPage.getByTestId(HomeScreenSelectors.ResumeButton)).toBeVisible();
    await returningPage.reload();
    await returningPage.getByTestId(HomeScreenSelectors.ResumeButton).click();
    await expect(returningPage.getByTestId(GameScreenSelectors.Root)).toBeVisible();
    expect(await returningPage.getByTestId(/^CellSelectors\.Cell\./u).allTextContents()).toEqual(savedGrid);
});

test('surfaces a worker that exits before ready and retries with a fresh runtime', async ({ context, page }) => {
    await page.route('**/sqlite-opfs-*.js', route => route.fulfill({ contentType: 'application/javascript', body: 'self.close();' }));
    await page.goto('/play');
    await expect(page.getByRole('alert')).toHaveText('Unable to load your game', { timeout: bootTimeoutMilliseconds });
    const recoveryPage = await context.newPage();
    await launchHome(recoveryPage);
    await recoveryPage.close();
    await page.unroute('**/sqlite-opfs-*.js');
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});

test.describe('localized contention', () => {
    test.use({ locale: 'uk-UA' });

    test('explains the blocked tab in the browser language', async ({ context, page }) => {
        await launchHome(page);
        const secondPage = await context.newPage();
        await secondPage.goto('/play');
        await expect(secondPage.getByRole('alert')).toContainText('Suuudokuuu відкрито в іншій вкладці.');
        await expect(secondPage.getByRole('button', { name: 'Спробувати ще раз' })).toBeVisible();
    });
});
