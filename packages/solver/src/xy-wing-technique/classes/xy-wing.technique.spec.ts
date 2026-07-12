import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { XYWingTechnique } from './xy-wing.technique';

describe('XYWingTechnique', () => {
    it('finds two pincers that remove their shared outside value', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
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
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(new XYWingTechnique().find(context), {
            technique: SolutionTechniqueEnum.XYWing,
            results: [[8, 3, 6]],
            eliminations: [[8, 3, 6]]
        });
    });

    it('ignores pincers without a unique pivot value split', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [1, 2]], [0, 4, [1, 2]], [4, 0, [2, 3]]);
        const results = new XYWingTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XYWing)).toBe(false);
    });
});
