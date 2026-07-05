import { describe, expect, it } from '@jest/globals';
import { Sudoku, createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { NakedPairTechnique } from './naked-pair.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

describe('NakedPairTechnique', () => {
    it('finds a pair whose candidates can be removed from peers', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.34.7.91.',
            '672195348',
            '.9.34.567',
            '859761423',
            '426.5379.',
            '713924856',
            '961537284',
            '287419635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new NakedPairTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.NakedPair,
                eliminations: expect.arrayContaining([{ cell: { x: 3, y: 0, value: 0, group: 4 }, value: 8 }])
            })
        );
    });

    it('ignores a pair when one cell has a third candidate', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [1, 2, 3],
            [CandidateContext.getCellKey(field[0][1])]: [1, 2],
            [CandidateContext.getCellKey(field[0][2])]: [1, 4]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const results = new NakedPairTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.NakedPair)).toBe(false);
    });
});
