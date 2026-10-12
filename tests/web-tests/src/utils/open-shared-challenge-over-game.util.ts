import { expect } from '@playwright/test';
import { ChallengeAcceptScreenSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { pushStackRoute } from './push-stack-route.util';

import type { Page } from '@playwright/test';

export const openSharedChallengeOverGame = async (page: Page, encodedChallenge: string): Promise<void> => {
    await pushStackRoute(page, GameScreenSelectors.Root, 'shared/[url]', { url: encodedChallenge });
    await expect(page.getByTestId(ChallengeAcceptScreenSelectors.Root)).toBeVisible();
};
