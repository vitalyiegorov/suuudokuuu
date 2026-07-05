import { describe, expect, it } from '@jest/globals';
import { Sudoku, createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { XWingTechnique } from './x-wing.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

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

        expect(new XWingTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.XWing,
                eliminations: expect.arrayContaining([{ cell: { x: 1, y: 3, value: 0, group: 2 }, value: 6 }])
            })
        );
    });

    it('ignores a base row with a third occurrence', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][3])]: [5, 7],
            [CandidateContext.getCellKey(field[0][5])]: [5, 8],
            [CandidateContext.getCellKey(field[3][0])]: [5, 6],
            [CandidateContext.getCellKey(field[3][3])]: [5, 7],
            [CandidateContext.getCellKey(field[6][0])]: [5, 9]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const results = new XWingTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.XWing)).toBe(false);
    });
});
