import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { UniqueRectangleTechnique } from './unique-rectangle.technique';

describe('UniqueRectangleTechnique', () => {
    it('removes the deadly pair from the corner that carries extra candidates', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '891673254',
            '743125869',
            '625489137',
            '937...412',
            '268714395',
            '514932678',
            '186297543',
            '3.2.4.98.',
            '4.93..7..'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new UniqueRectangleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.UniqueRectangle,
                kind: 'elimination',
                result: [8, 5, 1],
                eliminations: [
                    [8, 5, 1],
                    [8, 5, 6]
                ],
                reasonCells: [
                    [7, 5],
                    [7, 8],
                    [8, 8]
                ]
            }
        ]);
    });

    it('removes the deadly pair from a rectangle spanning two side by side boxes', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '397856412',
            '.1.743965',
            '645219..8',
            '.7.624..1',
            '136578294',
            '...391..6',
            '...9.71.3',
            '781432659',
            '...1.58.7'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new UniqueRectangleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.UniqueRectangle,
                kind: 'elimination',
                result: [8, 2, 2],
                eliminations: [
                    [8, 2, 2],
                    [8, 2, 4]
                ],
                reasonCells: [
                    [6, 2],
                    [6, 7],
                    [8, 7]
                ]
            }
        ]);
    });

    it('ignores a rectangle that spreads over four boxes', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 4, [1, 2]], [4, 0, [1, 2]], [4, 4, [1, 2, 3]]);

        expect(new UniqueRectangleTechnique().find(context)).toEqual([]);
    });

    it('ignores a rectangle whose corners all hold only the deadly pair', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [1, 2]], [3, 0, [1, 2]], [3, 1, [1, 2]]);

        expect(new UniqueRectangleTechnique().find(context)).toEqual([]);
    });

    it('ignores a rectangle whose corners do not share one candidate pair', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 1, [1, 3]], [3, 0, [1, 2]], [3, 1, [1, 2, 4]]);

        expect(new UniqueRectangleTechnique().find(context)).toEqual([]);
    });
});
