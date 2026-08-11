import { expect, test } from '@playwright/test';
import { HomeScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { bringAppToForeground } from '../src/utils/bring-app-to-foreground.util';
import { launchHome } from '../src/utils/launch-home.util';
import { readBackdropFilterChanges } from '../src/utils/read-backdrop-filter-changes.util';
import { restoreAppFromBfcache } from '../src/utils/restore-app-from-bfcache.util';
import { sendAppToBackground } from '../src/utils/send-app-to-background.util';
import { watchBackdropFilterChanges } from '../src/utils/watch-backdrop-filter-changes.util';

const firstLayerCleared = '0:none';
const firstLayerRestored = '0:restored';

test('clears and restores the backdrop-filter layers when the app returns to visibility', async ({ page }) => {
    await launchHome(page);
    const watchedLayerCount = await watchBackdropFilterChanges(page);
    expect(watchedLayerCount).toBeGreaterThan(0);

    await sendAppToBackground(page);
    await bringAppToForeground(page);

    const changes = await readBackdropFilterChanges(page);
    expect(changes).toContain(firstLayerCleared);
    expect(changes).toContain(firstLayerRestored);
    expect(changes.indexOf(firstLayerCleared)).toBeLessThan(changes.indexOf(firstLayerRestored));

    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});

test('clears and restores the backdrop-filter layers when the page is restored from the bfcache', async ({ page }) => {
    await launchHome(page);
    const watchedLayerCount = await watchBackdropFilterChanges(page);
    expect(watchedLayerCount).toBeGreaterThan(0);

    await restoreAppFromBfcache(page);

    const changes = await readBackdropFilterChanges(page);
    expect(changes).toContain(firstLayerCleared);
    expect(changes).toContain(firstLayerRestored);

    await expect(page.getByTestId(HomeScreenSelectors.Root)).toBeVisible();
});
