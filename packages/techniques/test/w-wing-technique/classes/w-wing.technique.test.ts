import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { WWingTechnique } from '../../../src/w-wing-technique/classes/w-wing.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('WWingTechnique', () => {
    it('finds matching bivalue cells connected by a strong link', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([3, 0, [1, 2]], [4, 4, [1, 2]], [3, 8, [1, 5]], [4, 8, [1, 6]], [4, 0, [2, 9]]);

        expectTechniqueResults(context, new WWingTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.WWing,
                kind: 'elimination',
                result: [4, 0, 2],
                eliminations: [[4, 0, 2]],
                reasonCells: [
                    [3, 0],
                    [4, 4],
                    [3, 8],
                    [4, 8]
                ]
            }
        ]);
    });

    it('rejects matching bivalue cells that see each other on a real board', () => {
        const context = CandidateContext.fromSudoku(
            Sudoku.fromStrings(
                defaultSudokuConfig,
                '534.78912',
                '672195.48',
                '198342567',
                '859761.23',
                '42685.791',
                '71392485.',
                '..15.7284',
                '287419.35',
                '.45.8.17.'
            )
        );

        expect(context.getCandidates(context.getRowCells(6)[0])).toEqual([3, 9]);
        expect(context.getCandidates(context.getRowCells(8)[0])).toEqual([3, 9]);
        expect(new WWingTechnique().find(context)).toEqual([]);
    });

    it('finds a strong link oriented opposite to the wing cell order', () => {
        const context = createCandidateContextFromMap([0, 4, [1, 2]], [4, 3, [1, 2]], [8, 3, [1, 5]], [8, 4, [1, 6]], [0, 3, [2, 9]]);

        expectTechniqueResults(context, new WWingTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.WWing,
                kind: 'elimination',
                result: [0, 3, 2],
                eliminations: [[0, 3, 2]],
                reasonCells: [
                    [0, 4],
                    [4, 3],
                    [8, 3],
                    [8, 4]
                ]
            }
        ]);
    });

    it('rejects matching wing cells when a third candidate position breaks the connecting strong link', () => {
        const context = createCandidateContextFromMap(
            [0, 4, [1, 2]],
            [4, 3, [1, 2]],
            [8, 3, [1, 5]],
            [8, 4, [1, 6]],
            [8, 5, [1, 7]],
            [0, 3, [2, 9]]
        );

        expect(new WWingTechnique().find(context)).toEqual([]);
    });
});
