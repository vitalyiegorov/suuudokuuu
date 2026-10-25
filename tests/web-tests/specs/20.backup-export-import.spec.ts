import { expect, test } from '@playwright/test';
import {
    ChallengeResultFooterSelectors,
    CompletedGameItemSelectors,
    HistoryDifficultySelectors,
    HomeScreenSelectors,
    SettingsScreenSelectors
} from '@suuudokuuu/app/src/selectors';

import { winningSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { completeWinningSharedChallenge } from '../src/utils/complete-winning-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';

import type { Page } from '@playwright/test';

const openSettings = async (page: Page) => {
    await page.getByText('Settings').click();
    await expect(page.getByTestId(SettingsScreenSelectors.Root)).toBeVisible();
};

test('exports progress to a file and restores it in a fresh browser', async ({ browser, page }, testInfo) => {
    await launchHome(page);
    await completeWinningSharedChallenge(page, winningSharedChallengeEncodedConstant);
    await page.getByTestId(ChallengeResultFooterSelectors.HomeButton).click();
    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
    await openSettings(page);

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId(SettingsScreenSelectors.ExportBackupButton).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^suuudokuuu-backup-\d{4}-\d{2}-\d{2}\.json$/u);
    const backupPath = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(backupPath);

    const freshContext = await browser.newContext();
    const freshPage = await freshContext.newPage();
    const dialogMessages: string[] = [];
    freshPage.on('dialog', async dialog => {
        dialogMessages.push(dialog.message());
        await dialog.accept();
    });

    await launchHome(freshPage);
    await openSettings(freshPage);
    const fileChooserPromise = freshPage.waitForEvent('filechooser');
    await freshPage.getByTestId(SettingsScreenSelectors.ImportBackupButton).click();
    await (await fileChooserPromise).setFiles(backupPath);
    await expect
        .poll(() => dialogMessages)
        .toEqual([expect.stringMatching(/^Import backup\?/u), expect.stringMatching(/^Backup imported/u)]);

    await freshPage.getByText('Stats').click();
    await freshPage.getByTestId(`${HistoryDifficultySelectors.Card}.Newbie`).click();
    await expect(freshPage.getByTestId(CompletedGameItemSelectors.ReplayButton)).toBeVisible();

    await freshContext.close();
});
