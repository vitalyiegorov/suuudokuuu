import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { SueDeCoqTechnique } from '../../../src/sue-de-coq-technique/classes/sue-de-coq.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('SueDeCoqTechnique', () => {
    it('locks a column-box intersection with one arm in the column and one in the box', () => {
        expect.assertions(2);

        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('9...51348....986758.5.6329121.985.36..8327.19..9146.82783612954..2839167.9.574823', defaultSudokuConfig)
        );
        const results = new SueDeCoqTechnique().find(context);

        expectTechniqueResults(context, results, [
            {
                technique: SolutionTechniqueEnum.SueDeCoq,
                kind: 'elimination',
                result: [0, 1, 7],
                eliminations: [
                    [0, 1, 7],
                    [1, 0, 4],
                    [1, 1, 4]
                ],
                reasonCells: [
                    [0, 2],
                    [1, 2],
                    [8, 2],
                    [2, 1]
                ]
            }
        ]);
        expect(results[0].patternCandidates?.map(({ cell, value }) => [cell.y, cell.x, value])).toEqual([
            [0, 2, 6],
            [0, 2, 7],
            [1, 2, 1],
            [1, 2, 4],
            [8, 2, 1],
            [8, 2, 6],
            [2, 1, 4],
            [2, 1, 7]
        ]);
    });

    it('accepts every arm combination that keeps the cells locked', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [1, 2, 3, 4]],
            [0, 1, [1, 2, 3, 4]],
            [0, 5, [1, 2]],
            [0, 7, [1, 5]],
            [1, 0, [3, 4]],
            [2, 2, [3, 6]]
        );
        const core: [number, number][] = [
            [0, 0],
            [0, 1]
        ];

        expectTechniqueResults(context, new SueDeCoqTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.SueDeCoq,
                kind: 'elimination',
                result: [0, 7, 1],
                eliminations: [
                    [0, 7, 1],
                    [2, 2, 3]
                ],
                reasonCells: [...core, [0, 5], [1, 0]]
            },
            {
                technique: SolutionTechniqueEnum.SueDeCoq,
                kind: 'elimination',
                result: [0, 7, 1],
                eliminations: [[0, 7, 1]],
                reasonCells: [...core, [0, 5], [1, 0], [2, 2]]
            },
            {
                technique: SolutionTechniqueEnum.SueDeCoq,
                kind: 'elimination',
                result: [2, 2, 3],
                eliminations: [[2, 2, 3]],
                reasonCells: [...core, [0, 5], [0, 7], [1, 0]]
            }
        ]);
    });

    it('rejects arms that share a digit', () => {
        const context = createCandidateContextFromMap(
            [0, 0, [1, 2, 3, 4]],
            [0, 1, [1, 2, 3, 4]],
            [0, 5, [1, 2]],
            [0, 7, [1, 5]],
            [1, 0, [2, 4]],
            [2, 2, [3, 6]]
        );

        expect(new SueDeCoqTechnique().find(context)).toEqual([]);
    });

    it('rejects an intersection without two extra digits', () => {
        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [0, 1, [1, 2, 3]], [0, 5, [1, 4]], [1, 0, [3, 5]], [0, 7, [1, 4]]);

        expect(new SueDeCoqTechnique().find(context)).toEqual([]);
    });
});
