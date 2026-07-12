import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { historyGetSelectedDifficulty } from './history-get-selected-difficulty.util';

describe('historyGetSelectedDifficulty', () => {
    it('keeps the preferred difficulty when it has stats', () => {
        const selectedDifficulty = historyGetSelectedDifficulty([DifficultyEnum.Newbie, DifficultyEnum.Hard], DifficultyEnum.Hard);

        expect(selectedDifficulty).toBe(DifficultyEnum.Hard);
    });

    it('falls back to the first completed difficulty when the preferred difficulty has no stats', () => {
        const selectedDifficulty = historyGetSelectedDifficulty([DifficultyEnum.Newbie], DifficultyEnum.Hard);

        expect(selectedDifficulty).toBe(DifficultyEnum.Newbie);
    });

    it('keeps the preferred difficulty when there are no completed difficulties', () => {
        const selectedDifficulty = historyGetSelectedDifficulty([], DifficultyEnum.Hard);

        expect(selectedDifficulty).toBe(DifficultyEnum.Hard);
    });
});
