import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { EmptyRectangleTechnique } from '../../../src/empty-rectangle-technique/classes/empty-rectangle.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

const createSolvePathContext = (): CandidateContext => {
    const sudoku = Sudoku.fromString(
        '....27..1..7..1.2.123.45......7163.231628....7.2.5316823.16.875875..261..615782..',
        defaultSudokuConfig
    );

    return CandidateContext.fromSudoku(sudoku).withEliminations([
        { cell: sudoku.Field[1][1], value: 9 },
        { cell: sudoku.Field[3][7], value: 5 },
        { cell: sudoku.Field[4][8], value: 9 },
        { cell: sudoku.Field[7][8], value: 3 }
    ]);
};

describe('EmptyRectangleTechnique', () => {
    it('removes the digit seen by both the box cross and the far end of a row strong link', () => {
        expect.assertions(1);

        const context = createSolvePathContext();

        expectTechniqueResults(context, new EmptyRectangleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.EmptyRectangle,
                kind: 'elimination',
                result: [4, 8, 4],
                eliminations: [[4, 8, 4]],
                reasonCells: [
                    [4, 5],
                    [5, 3],
                    [7, 3],
                    [7, 8]
                ]
            }
        ]);
    });

    it('finds an empty rectangle linked through a column on a real board', () => {
        expect.assertions(1);

        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('8.............1..2.34....5.........6..5...43.7...12.......5...8...3.....2.......1', defaultSudokuConfig)
        );

        expectTechniqueResults(context, new EmptyRectangleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.EmptyRectangle,
                kind: 'elimination',
                result: [3, 0, 1],
                eliminations: [[3, 0, 1]],
                reasonCells: [
                    [0, 1],
                    [0, 2],
                    [2, 0],
                    [0, 7],
                    [3, 7]
                ]
            }
        ]);
    });

    it('eliminates through a synthetic column link from a box cross', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 1, [1, 2]],
            [0, 2, [1, 3]],
            [1, 0, [1, 4]],
            [2, 0, [1, 5]],
            [0, 5, [1, 6]],
            [4, 5, [1, 7]],
            [4, 0, [1, 8]],
            [4, 8, [1, 9]]
        );

        expectTechniqueResults(context, new EmptyRectangleTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.EmptyRectangle,
                kind: 'elimination',
                result: [4, 0, 1],
                eliminations: [[4, 0, 1]],
                reasonCells: [
                    [0, 1],
                    [0, 2],
                    [1, 0],
                    [2, 0],
                    [0, 5],
                    [4, 5]
                ]
            }
        ]);
    });

    it('rejects box candidates that do not fit one row and one column', () => {
        const context = createCandidateContextFromMap(
            [0, 1, [1, 2]],
            [1, 2, [1, 3]],
            [2, 0, [1, 5]],
            [0, 5, [1, 6]],
            [4, 5, [1, 7]],
            [4, 0, [1, 8]]
        );

        expect(new EmptyRectangleTechnique().find(context)).toEqual([]);
    });

    it('rejects a strong link whose far end aims back into the box', () => {
        const context = createCandidateContextFromMap(
            [0, 1, [1, 2]],
            [0, 2, [1, 3]],
            [1, 0, [1, 4]],
            [2, 0, [1, 5]],
            [0, 5, [1, 6]],
            [2, 5, [1, 7]]
        );

        expect(new EmptyRectangleTechnique().find(context)).toEqual([]);
    });

    it('rejects a strong link that starts inside the box or leaves no candidate to remove', () => {
        const context = createCandidateContextFromMap(
            [0, 1, [1, 2]],
            [0, 2, [1, 3]],
            [1, 0, [1, 4]],
            [2, 0, [1, 5]],
            [5, 1, [1, 6]],
            [0, 5, [1, 6]],
            [4, 5, [1, 7]]
        );

        expect(new EmptyRectangleTechnique().find(context)).toEqual([]);
    });
});
