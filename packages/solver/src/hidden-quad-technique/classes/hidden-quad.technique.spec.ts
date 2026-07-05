import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import { HiddenQuadTechnique } from './hidden-quad.technique';

describe('HiddenQuadTechnique', () => {
    it('finds a quad hidden inside four cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '534678.12',
            '672195348',
            '1983.25.7',
            '8.9...42.',
            '4268..7.1',
            '.13..4856',
            '961537.84',
            '28.4.9635',
            '345286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new HiddenQuadTechnique().find(context)).toContainEqual(
            expect.objectContaining({
                technique: SolutionTechniqueEnum.HiddenQuad,
                eliminations: expect.arrayContaining([{ cell: { x: 4, y: 3, value: 0, group: 5 }, value: 5 }])
            })
        );
    });
});
