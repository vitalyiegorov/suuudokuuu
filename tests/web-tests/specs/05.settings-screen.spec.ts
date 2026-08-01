import { expect, test } from '@playwright/test';
import {
    HeaderBackButtonSelectors,
    HomeScreenSelectors,
    SettingsAppFooterSelectors,
    SettingsOptionSheetSelectors,
    SettingsScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { launchHome } from '../src/utils/launch-home.util';
import { getVisibleByTestId } from '../src/utils/visible-locator.util';

test('navigates settings, changes cell spacing, and opens the privacy policy', async ({ page }) => {
    await launchHome(page);
    await page.getByText('Settings').click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();

    await expect(page.getByText('Game', { exact: true })).toBeVisible();
    await expect(page.getByText(/Language/u)).toBeVisible();
    await expect(page.getByText(/Number size/u)).toBeVisible();
    await expect(page.getByText(/Cell spacing/u)).toBeVisible();

    await page.getByTestId(SettingsScreenSelectors.CellSpacingOption).click();
    const cellSpacingSheet = page.getByTestId(SettingsOptionSheetSelectors.Root);
    await expect(cellSpacingSheet).toBeVisible();

    await cellSpacingSheet.getByText('Spacious', { exact: true }).click();
    await expect(cellSpacingSheet).not.toBeVisible();

    await page.getByTestId(SettingsAppFooterSelectors.PrivacyPolicyLink).scrollIntoViewIfNeeded();
    await expect(page.getByTestId(SettingsAppFooterSelectors.ReportBugLink)).toBeVisible();
    await expect(page.getByTestId(SettingsAppFooterSelectors.PrivacyPolicyLink)).toBeVisible();

    await page.getByTestId(SettingsAppFooterSelectors.PrivacyPolicyLink).click();
    await expect(page).toHaveURL(/\/privacy-policy/u);

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();

    await getVisibleByTestId(page, HeaderBackButtonSelectors.Root).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});
