import { expect, test } from '@playwright/test';
import {
    DailyScreenSelectors,
    HistoryScreenSelectors,
    HomeScreenSelectors,
    MainTabSelectors,
    SettingsScreenSelectors
} from '@suuudokuuu/app/src/selectors';
import vercelConfig from '@suuudokuuu/app/vercel.json';

import { launchHome } from '../src/utils/launch-home.util';

import type { Page } from '@playwright/test';

const tabs = [
    { tab: MainTabSelectors.Daily, path: '/daily', screen: DailyScreenSelectors.Root },
    { tab: MainTabSelectors.Stats, path: '/history', screen: HistoryScreenSelectors.Root },
    { tab: MainTabSelectors.Settings, path: '/settings', screen: SettingsScreenSelectors.Root },
    { tab: MainTabSelectors.Play, path: '/play', screen: HomeScreenSelectors.Root }
] as const;

const spaRoutePatterns = vercelConfig.routes.flatMap(route =>
    'dest' in route && route.dest === '/_app/index.html' ? [new RegExp(route.src, 'u')] : []
);

const expectTabScreen = async (page: Page, { tab, path, screen }: (typeof tabs)[number]) => {
    await expect(page.getByTestId(screen)).toBeVisible();
    await expect(page).toHaveURL(path);
    await expect(page.getByTestId(tab)).toHaveAttribute('aria-selected', 'true');
    for (const { tab: barItem } of tabs) {
        await expect(page.getByTestId(barItem)).toBeVisible();
    }
};

test('every tab bar item opens its screen at its URL with the bar shown', async ({ page }) => {
    await launchHome(page);

    for (const tab of tabs) {
        await page.getByTestId(tab.tab).click();
        await expectTabScreen(page, tab);
    }
});

for (const tab of tabs) {
    test(`a hard reload on ${tab.path} keeps the app screen and the tab bar`, async ({ page }) => {
        expect(spaRoutePatterns.some(pattern => pattern.test(tab.path))).toBe(true);

        await page.goto(tab.path);
        await expect(page.getByTestId(tab.screen)).toBeVisible();
        await page.reload();
        await expectTabScreen(page, tab);
    });
}
