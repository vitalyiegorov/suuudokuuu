import { describe, expect, it } from '@jest/globals';

import { ChallengeProgressBarMinWidthConstant } from '../../challenge/components/challenge-progress-bar/constant/challenge-progress-bar.constant';

import { GameSidePanelWidthConstant } from './board-cell-size.constant';

describe('GameSidePanelWidthConstant', () => {
    it('stays at or above the challenge progress bar minimum width', () => {
        expect(GameSidePanelWidthConstant).toBeGreaterThanOrEqual(ChallengeProgressBarMinWidthConstant);
    });
});
