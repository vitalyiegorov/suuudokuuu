import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { HiddenPairTechnique } from './hidden-pair.technique';

describe('HiddenPairTechnique', () => {
    it('finds a pair hidden inside two cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '5.46..912',
            '67219.34.',
            '1983.2567',
            '859761423',
            '4268.3791',
            '713924.56',
            '96153728.',
            '287419635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new HiddenPairTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.HiddenPair,
                eliminations: expect.arrayContaining([{ cell: { x: 5, y: 1, value: 0, group: 4 }, value: 8 }])
            })
        );
    });
});
