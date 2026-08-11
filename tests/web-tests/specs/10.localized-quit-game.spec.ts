import { expect, test } from '@playwright/test';
import { PauseScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { quitCurrentGame } from '../src/utils/quit-current-game.util';
import { quitPausedGame } from '../src/utils/quit-paused-game.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';
import { startNewGame } from '../src/utils/start-new-game.util';

const pauseScreenTimeoutMilliseconds = 10000;

test.use({ locale: 'uk-UA' });

test('quits from the game screen and starts another game when the app language translates OK', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    await quitCurrentGame(page);
    await startNewGame(page);
});

test('quits from the pause screen when the app language translates OK', async ({ page }) => {
    await launchHome(page);
    await startNewGame(page);

    await sendAppToBackground(page);
    await expect(page.getByTestId(PauseScreenSelectors.Root)).toBeVisible({ timeout: pauseScreenTimeoutMilliseconds });
    await bringAppToForeground(page);

    await quitPausedGame(page);
    await startNewGame(page);
});
