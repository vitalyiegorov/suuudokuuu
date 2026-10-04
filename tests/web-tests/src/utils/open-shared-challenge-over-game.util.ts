import { expect } from '@playwright/test';
import { ChallengeAcceptScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

export const openSharedChallengeOverGame = async (page: Page, encodedChallenge: string): Promise<void> => {
    await page.getByTestId(GameScreenSelectors.Root).evaluate((gameScreen, url) => {
        let fiber: unknown = Object.entries(gameScreen).find(([key]) => key.startsWith('__reactFiber$'))?.[1] ?? null;

        while (typeof fiber === 'object' && fiber !== null) {
            const props = 'memoizedProps' in fiber ? fiber.memoizedProps : null;
            const navigation = typeof props === 'object' && props !== null && 'value' in props ? props.value : null;
            const push = typeof navigation === 'object' && navigation !== null && 'push' in navigation ? navigation.push : null;

            if (typeof push === 'function') {
                push.call(navigation, 'shared/[url]', { url });

                return;
            }

            fiber = 'return' in fiber ? fiber.return : null;
        }

        throw new Error('Game screen has no stack navigation to push onto');
    }, encodedChallenge);
    await expect(page.getByTestId(ChallengeAcceptScreenSelectors.Root)).toBeVisible();
};
