import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { XYZWingTechnique } from '../../../src/xyz-wing-technique/classes/xyz-wing.technique';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

describe('XYZWingTechnique', () => {
    it('finds a three-candidate pivot with two restricted pincers', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2, 3]], [1, 1, [3, 4]], [0, 1, [1, 3]], [1, 0, [2, 3]]);

        expectTechniqueResults(context, new XYZWingTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.XYZWing,
                kind: 'elimination',
                result: [1, 1, 3],
                eliminations: [[1, 1, 3]],
                reasonCells: [
                    [0, 0],
                    [0, 1],
                    [1, 0]
                ]
            }
        ]);
    });

    it('does not eliminate candidates on a real board without a wing', () => {
        const context = CandidateContext.fromSudoku(
            Sudoku.fromString('000000051000000023004005000000000600000130000007680000429006500370400000810000000', defaultSudokuConfig)
        );

        expect(context.getBlankCells().some(cell => context.getCandidates(cell).length === 3)).toBe(true);
        expect(context.getBlankCells().some(cell => context.getCandidates(cell).length === 2)).toBe(true);
        expect(new XYZWingTechnique().find(context)).toEqual([]);
    });
});
