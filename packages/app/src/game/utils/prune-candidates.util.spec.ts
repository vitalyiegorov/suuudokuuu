import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { pruneCandidates } from './prune-candidates.util';

const PuzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const createSudoku = () => Sudoku.fromString(PuzzleString, defaultSudokuConfig);

describe('pruneCandidates', () => {
    it('filters candidates of blank cells sharing a row, column, or group with the placed cell', () => {
        expect.assertions(3);

        const sudoku = createSudoku();
        const correctCell = { ...sudoku.Field[0][2], value: 4 };

        sudoku.setCellValue(correctCell);

        const pruned = pruneCandidates(
            {
                '0-3': [1, 4, 7],
                '0-5': [9],
                '1-1': [4, 5]
            },
            sudoku,
            correctCell
        );

        for (const key of ['0-3', '0-5', '1-1']) {
            const possibleValues = sudoku.getCellCandidates(sudoku.Field[Number(key[0])][Number(key[2])]);

            expect(pruned[key].every(candidateValue => possibleValues.includes(candidateValue))).toBe(true);
        }
    });

    it('creates entries for affected cells missing from the candidate map and leaves unrelated cells untouched', () => {
        expect.assertions(3);

        const sudoku = createSudoku();
        const correctCell = { ...sudoku.Field[0][2], value: 4 };

        sudoku.setCellValue(correctCell);

        const unrelatedCandidates = [2, 5];

        const pruned = pruneCandidates({ '8-8': unrelatedCandidates }, sudoku, correctCell);

        expect(pruned['8-8']).toBe(unrelatedCandidates);
        expect(pruned).toHaveProperty('0-5');
        expect(Array.isArray(pruned['0-5'])).toBe(true);
    });
});
