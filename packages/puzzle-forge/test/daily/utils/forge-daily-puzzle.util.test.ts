import { describe, expect, it } from 'vitest';

import { DAILY_DIFFICULTY_LADDER } from '../../../src/@generic/constants/daily-challenge.constant';
import { DIFFICULTY_BANDS } from '../../../src/@generic/constants/difficulty-band.constant';
import { forgeDailyPuzzle } from '../../../src/daily/utils/forge-daily-puzzle.util';
import { getDailyDifficulty } from '../../../src/daily/utils/get-daily-difficulty.util';

const generousAttemptBudget = 200;
const seededDailyFixtures = [
    { date: '2026-08-23', puzzle: '2....8.3.9.5.1.2..168.4.95.5.7..9.8...38..5...91.2.3.44..2.17..3..5.7..1..2.63.9.', rating: 2.3 },
    { date: '2026-08-24', puzzle: '..591263..9.3.8.1..8....9.....13586....26..5...34..1....8...5......713..46....2..', rating: 2.3 },
    { date: '2026-08-25', puzzle: '..87...355.1.9..2............9....6..67.2.3..1.....547.4...6.7.7.35....89.......3', rating: 2.6 },
    { date: '2026-08-26', puzzle: '721..9........3...........9.6...8....37.128..9.....34...52.7..63.....21...9..6..3', rating: 4.2 }
];

describe('forgeDailyPuzzle', () => {
    it.each(seededDailyFixtures)('should preserve the daily board and rating for $date', ({ date, puzzle, rating }) => {
        const result = forgeDailyPuzzle(date, generousAttemptBudget);
        const difficulty = getDailyDifficulty(date);

        expect(result.sudoku.toString()).toBe(puzzle);
        expect(result.rating).toBe(rating);
        expect(result.isInBand).toBe(true);
        expect(result.isRatingCeiling).toBe(false);
        expect(result.sudoku.Difficulty).toBe(difficulty);
        expect(puzzle.split('').filter(character => character === '.')).toHaveLength(DIFFICULTY_BANDS[difficulty].blankCells);
    });

    it.each(DAILY_DIFFICULTY_LADDER)('should keep the daily %s tier generated', difficulty => {
        expect(DIFFICULTY_BANDS[difficulty].corpus).toBeNull();
    });
});
