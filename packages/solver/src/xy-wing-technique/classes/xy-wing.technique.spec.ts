import { describe, expect, it } from '@jest/globals';
import { Sudoku, createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { XYWingTechnique } from './xy-wing.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

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

        expect(new XYWingTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XYWing,
                eliminations: expect.arrayContaining([{ cell: { x: 3, y: 8, value: 0, group: 6 }, value: 6 }])
            })
        );
    });

    it('ignores pincers without a unique pivot value split', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [1, 2],
            [CandidateContext.getCellKey(field[0][4])]: [1, 2],
            [CandidateContext.getCellKey(field[4][0])]: [2, 3]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const results = new XYWingTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XYWing)).toBe(false);
    });
});
