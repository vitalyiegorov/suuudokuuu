import { describe, expect, it } from '@jest/globals';

import { gameHasNewPersonalBestScoreSelector } from './game.selectors';
import { initialGameState } from './game.state';

describe('gameHasNewPersonalBestScoreSelector', () => {
    it('returns the persisted result flag', () => {
        expect(gameHasNewPersonalBestScoreSelector.resultFunc({ ...initialGameState, hasNewPersonalBestScore: true })).toBe(true);
        expect(gameHasNewPersonalBestScoreSelector.resultFunc({ ...initialGameState, hasNewPersonalBestScore: false })).toBe(false);
    });
});
