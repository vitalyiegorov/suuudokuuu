import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { BasicFishTechnique } from '../../basic-fish-technique/classes/basic-fish.technique';

describe('XWingTechnique', () => {
    it('finds a rectangular pair of strong fish lines', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '53467891.',
            '672195.48',
            '1.83.2567',
            '...7..4.3',
            '.2.8.3.91',
            '713924856',
            '..1537284',
            '287419635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context), {
            technique: SolutionTechniqueEnum.XWing,
            results: [[3, 1, 6]],
            eliminations: [[3, 1, 6]]
        });
    });

    it('ignores a base row with a third occurrence', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap(
            [0, 0, [5, 6]],
            [0, 3, [5, 7]],
            [0, 5, [5, 8]],
            [3, 0, [5, 6]],
            [3, 3, [5, 7]],
            [6, 0, [5, 9]]
        );
        const results = new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XWing)).toBe(false);
    });

    it('uses only fish pattern candidates as reason cells', () => {
        expect.assertions(1);

        const context = createCandidateContextFromMap([0, 0, [5, 6]], [0, 3, [5, 7]], [3, 0, [5, 6]], [3, 3, [5, 7]], [6, 0, [5, 9]]);
        const [result] = new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context);

        expect(result.reasonCells.map(cell => [cell.y, cell.x]).sort()).toEqual([
            [0, 0],
            [0, 3],
            [3, 0],
            [3, 3]
        ]);
    });
});
