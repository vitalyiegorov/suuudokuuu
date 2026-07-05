import { describe, expect, it } from '@jest/globals';
import { Sudoku, createEmptyField, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { PointingPairTechnique } from './pointing-pair.technique';

import type { CandidateMapType } from '../../@generic/types/candidate-map.type';

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

        expect(new PointingPairTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.PointingPair,
                eliminations: expect.arrayContaining([{ cell: { x: 8, y: 5, value: 0, group: 8 }, value: 1 }])
            })
        );
    });

    it('ignores candidates that span two rows in the box', () => {
        expect.assertions(1);

        const field = createEmptyField(defaultSudokuConfig);
        const candidateMap: CandidateMapType = {
            [CandidateContext.getCellKey(field[0][0])]: [5, 6],
            [CandidateContext.getCellKey(field[0][1])]: [5, 7],
            [CandidateContext.getCellKey(field[1][2])]: [5, 8],
            [CandidateContext.getCellKey(field[0][3])]: [5, 9]
        };
        const context = new CandidateContext(defaultSudokuConfig, field, candidateMap);
        const results = new PointingPairTechnique().find(context);

        expect(results.some(result => result.technique === SolutionTechniqueEnum.PointingPair)).toBe(false);
    });
});
