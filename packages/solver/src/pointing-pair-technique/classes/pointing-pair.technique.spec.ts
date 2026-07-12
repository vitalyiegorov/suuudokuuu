import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { PointingTechnique } from '../../pointing-technique/classes/pointing.technique';

describe('PointingPairTechnique', () => {
    it('finds a box candidate pair confined to one line', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '534678912',
            '672195348',
            '.9834.567',
            '85.761423',
            '42685379.',
            '..392485.',
            '961537284',
            '2.7419635',
            '3.5286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(new PointingTechnique({ technique: SolutionTechniqueEnum.PointingPair, size: 2 }).find(context), {
            technique: SolutionTechniqueEnum.PointingPair,
            results: [[5, 8, 6]],
            eliminations: [[5, 8, 1]]
        });
    });

    it('ignores candidates that span two rows in the box', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 1, [5, 7]], [1, 2, [5, 8]], [0, 3, [5, 9]]);
        const results = new PointingTechnique({ technique: SolutionTechniqueEnum.PointingPair, size: 2 }).find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.PointingPair)).toBe(false);
    });
});
