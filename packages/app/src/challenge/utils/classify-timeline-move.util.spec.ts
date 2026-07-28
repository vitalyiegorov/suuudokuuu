import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { classifyTimelineMove } from './classify-timeline-move.util';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const enabledPlacementBoard = [
    '.1.36..4.',
    '.3..5....',
    '24.9....8',
    '829..5..6',
    '453.26...',
    '761.39...',
    '68.29...1',
    '.925.....',
    '.746..9..'
];

describe('classifyTimelineMove', () => {
    it('should classify a placement into a known technique', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);
        const technique = classifyTimelineMove(sudoku, { ...sudoku.Field[0][2], value: 4 });

        expect(Object.values(SolutionTechniqueEnum)).toContain(technique);
    });

    it('should record the enabling technique instead of a guess', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...enabledPlacementBoard);
        const technique = classifyTimelineMove(sudoku, { ...sudoku.Field[6][5], value: 3 });

        expect(technique).toBe(SolutionTechniqueEnum.BoxLineReduction);
    });
});
