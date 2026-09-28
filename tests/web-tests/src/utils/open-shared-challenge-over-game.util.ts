import { expect } from '@playwright/test';
import { ChallengeAcceptScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import type { Page } from '@playwright/test';

export const openSharedChallengeOverGame = async (page: Page, encodedChallenge: string): Promise<void> => {
    await page.getByTestId(GameScreenSelectors.Root).evaluate((gameScreen, url) => {
        const fiberKey = Object.keys(gameScreen).find(key => key.startsWith('__reactFiber$')) ?? null;
        let fiber: unknown = fiberKey === null ? null : Reflect.get(gameScreen, fiberKey);

        while (typeof fiber === 'object' && fiber !== null) {
            const props: unknown = Reflect.get(fiber, 'memoizedProps');
            const navigation: unknown = typeof props === 'object' && props !== null ? Reflect.get(props, 'value') : null;
            const push: unknown = typeof navigation === 'object' && navigation !== null ? Reflect.get(navigation, 'push') : null;

            if (typeof push === 'function') {
                push.call(navigation, 'shared/[url]', { url });

                return;
            }

            fiber = Reflect.get(fiber, 'return');
        }

        throw new Error('Game screen has no stack navigation to push onto');
    }, encodedChallenge);
    await expect(page.getByTestId(ChallengeAcceptScreenSelectors.Root)).toBeVisible();
};
