import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { ALSXZTechnique } from '../../../src/als-xz-technique/classes/als-xz.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

const createSolvePathContext = (): CandidateContext => {
    const sudoku = Sudoku.fromString(
        '.325.468.864.3..2...5826...3281497566.925.1.8.51..8.922.3..58.9.86....7.597.8...4',
        defaultSudokuConfig
    );

    return CandidateContext.fromSudoku(sudoku).withEliminations([
        { cell: sudoku.Field[2][7], value: 1 },
        { cell: sudoku.Field[7][3], value: 3 },
        { cell: sudoku.Field[7][5], value: 1 },
        { cell: sudoku.Field[7][8], value: 1 },
        { cell: sudoku.Field[8][7], value: 3 }
    ]);
};

describe('ALSXZTechnique', () => {
    it('removes the common digit seen by both almost locked sets of a restricted pair', () => {
        expect.assertions(2);

        const context = createSolvePathContext();
        const results = new ALSXZTechnique().find(context);

        expectTechniqueResults(context, results, [
            {
                technique: SolutionTechniqueEnum.ALSXZ,
                kind: 'elimination',
                result: [6, 4, 1],
                eliminations: [[6, 4, 1]],
                reasonCells: [
                    [4, 1],
                    [6, 1],
                    [4, 5],
                    [7, 5],
                    [8, 5]
                ]
            }
        ]);
        expect(results[0].patternCandidates?.map(({ cell, value }) => [cell.y, cell.x, value])).toEqual([
            [4, 1, 7],
            [6, 1, 1],
            [4, 5, 7],
            [8, 5, 1]
        ]);
    });

    it('removes a common digit from every cell that sees all of its positions on a real board', () => {
        expect.assertions(1);

        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('59713...2..149.5..6......1....38..2.......4..73...98..48...7...9....3.....5.....6', defaultSudokuConfig)
        );

        expectTechniqueResults(context, new ALSXZTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.ALSXZ,
                kind: 'elimination',
                result: [3, 5, 6],
                eliminations: [
                    [3, 5, 6],
                    [4, 5, 6]
                ],
                reasonCells: [
                    [0, 5],
                    [1, 5],
                    [2, 3],
                    [2, 4],
                    [2, 5]
                ]
            }
        ]);
    });

    it('rejects almost locked sets whose shared digits do not see each other', () => {
        const context = createCandidateContextFromMap([0, 0, [1, 2]], [4, 4, [1, 2]], [0, 4, [2, 3]]);

        expect(new ALSXZTechnique().find(context)).toEqual([]);
    });
});
