import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { HellQueueEntrySchema } from '../schema/hell-queue-entry.schema';

import { HellQueueE2eSeedEntry } from './hell-queue-e2e-seed-entry.constant';

describe('HellQueueE2eSeedEntry', () => {
    it('is a schema-valid Hell queue entry', () => {
        expect(HellQueueEntrySchema.safeParse(HellQueueE2eSeedEntry).success).toBe(true);
    });

    it('reports a givensCount matching the number of filled clues in the puzzle string', () => {
        const givensCount = HellQueueE2eSeedEntry.puzzle.split('').filter(character => character !== '0').length;

        expect(givensCount).toBe(HellQueueE2eSeedEntry.givensCount);
    });

    it('has a hardcoded solution that matches the puzzle solved by the generator', () => {
        const sudoku = Sudoku.fromString(HellQueueE2eSeedEntry.puzzle, defaultSudokuConfig);
        const solvedString = sudoku.FullField.map(row => row.map(cell => cell.value).join('')).join('');

        expect(solvedString).toBe(HellQueueE2eSeedEntry.solution);
    });
});
