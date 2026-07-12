import { describe, expect, it } from '@jest/globals';

import { homeScreenGetCurrentGameProgress } from './home-screen-get-current-game-progress.util';

const FilledCellCount = 51;
const RemainingCellCount = 30;
const SolvedCellCount = 70;
const ExpectedProgress = 70;
const GridCellCount = 81;
const CompletedSolvedCellCount = 40;
const ThirtyRemainingCells = '1'.repeat(FilledCellCount) + '.'.repeat(RemainingCellCount);

describe('homeScreenGetCurrentGameProgress', () => {
    it('returns zero when no game is active', () => {
        expect(homeScreenGetCurrentGameProgress('', 0)).toBe(0);
    });

    it('returns zero when the player has not solved any cell', () => {
        expect(homeScreenGetCurrentGameProgress(ThirtyRemainingCells, 0)).toBe(0);
    });

    it('rounds solved cells against original player cell count', () => {
        expect(homeScreenGetCurrentGameProgress(ThirtyRemainingCells, SolvedCellCount)).toBe(ExpectedProgress);
    });

    it('returns completed progress when no blank cells remain', () => {
        expect(homeScreenGetCurrentGameProgress('1'.repeat(GridCellCount), CompletedSolvedCellCount)).toBe(100);
    });
});
