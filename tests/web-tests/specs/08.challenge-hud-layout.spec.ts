import { expect, test } from '@playwright/test';
import { ChallengeRaceHudSelectors, GameScreenSelectors } from '@suuudokuuu/app/src/selectors';

import { losingSharedChallengeEncodedConstant } from '../src/constants/shared-challenge-links.constant';
import { acceptSharedChallenge } from '../src/utils/accept-shared-challenge.util';
import { launchHome } from '../src/utils/launch-home.util';
import { openSharedChallenge } from '../src/utils/open-shared-challenge.util';
import { cellTestId, valueButtonTestId } from '../src/utils/test-id.util';

import type { Locator, Page } from '@playwright/test';

const boardTopLeftCellY = 0;
const boardTopLeftCellX = 0;
const boardBottomRightCellY = 8;
const boardBottomRightCellX = 8;
const firstNumpadValue = 1;
const wideHudWidthRatio = 0.5;
const compactHudWidthRatio = 0.9;
const compactLayoutProjectName = 'mobile-chromium';

const getRequiredBoundingBox = async (locator: Locator) => {
    const box = await locator.boundingBox();
    if (box === null) {
        throw new Error('Locator has no bounding box');
    }

    return box;
};

const getRequiredViewportSize = (page: Page) => {
    const viewportSize = page.viewportSize();
    if (viewportSize === null) {
        throw new Error('Page has no viewport size');
    }

    return viewportSize;
};

test('positions the rival-race challenge HUD for the current layout', async ({ page }, testInfo) => {
    await launchHome(page);
    await openSharedChallenge(page, losingSharedChallengeEncodedConstant);
    await acceptSharedChallenge(page);

    const hud = page.getByTestId(ChallengeRaceHudSelectors.Root);
    await expect(hud).toBeVisible();

    const hudBox = await getRequiredBoundingBox(hud);
    const viewportSize = getRequiredViewportSize(page);
    const boardTopLeftBox = await getRequiredBoundingBox(page.getByTestId(cellTestId(boardTopLeftCellY, boardTopLeftCellX)));

    const isCompactLayout = testInfo.project.name === compactLayoutProjectName;

    if (isCompactLayout) {
        expect(hudBox.y).toBeLessThan(boardTopLeftBox.y);
        expect(hudBox.width / viewportSize.width).toBeGreaterThan(compactHudWidthRatio);
    } else {
        const statusScoreBox = await getRequiredBoundingBox(page.getByTestId(GameScreenSelectors.Score));
        const boardBottomRightBox = await getRequiredBoundingBox(
            page.getByTestId(cellTestId(boardBottomRightCellY, boardBottomRightCellX))
        );
        const numpadFirstButtonBox = await getRequiredBoundingBox(page.getByTestId(valueButtonTestId(firstNumpadValue)));

        expect(hudBox.x).toBeGreaterThanOrEqual(boardBottomRightBox.x + boardBottomRightBox.width);
        expect(hudBox.y).toBeGreaterThanOrEqual(statusScoreBox.y + statusScoreBox.height);
        expect(hudBox.y + hudBox.height).toBeLessThanOrEqual(numpadFirstButtonBox.y);
        expect(hudBox.width / viewportSize.width).toBeLessThan(wideHudWidthRatio);
    }
});
