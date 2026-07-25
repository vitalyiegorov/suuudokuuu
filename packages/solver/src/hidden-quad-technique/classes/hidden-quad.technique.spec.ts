import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { HiddenSubsetTechnique } from '../../hidden-subset-technique/classes/hidden-subset.technique';

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

        expectTechniqueResults(context, new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenQuad, size: 4 }).find(context), [
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [[3, 4, 5]],
                reasonCells: [
                    [3, 3],
                    [3, 4],
                    [3, 5],
                    [3, 8]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 5, 3],
                eliminations: [[3, 5, 3]],
                reasonCells: [
                    [3, 1],
                    [3, 3],
                    [3, 4],
                    [3, 5]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [[3, 4, 5]],
                reasonCells: [
                    [2, 4],
                    [3, 4],
                    [5, 4],
                    [7, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 1],
                eliminations: [[3, 4, 1]],
                reasonCells: [
                    [2, 4],
                    [3, 4],
                    [4, 4],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [[3, 4, 5]],
                reasonCells: [
                    [3, 4],
                    [3, 5],
                    [4, 5],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 5, 3],
                eliminations: [[3, 5, 3]],
                reasonCells: [
                    [3, 4],
                    [3, 5],
                    [4, 4],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [
                    [3, 4, 5],
                    [3, 5, 3],
                    [5, 3, 7]
                ],
                reasonCells: [
                    [3, 4],
                    [3, 5],
                    [5, 3],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [
                    [3, 4, 5],
                    [5, 3, 7]
                ],
                reasonCells: [
                    [3, 4],
                    [3, 5],
                    [4, 5],
                    [5, 3]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 5, 3],
                eliminations: [
                    [3, 5, 3],
                    [5, 3, 7]
                ],
                reasonCells: [
                    [3, 4],
                    [3, 5],
                    [4, 4],
                    [5, 3]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 5],
                eliminations: [
                    [3, 4, 5],
                    [3, 5, 3]
                ],
                reasonCells: [
                    [3, 3],
                    [3, 4],
                    [3, 5],
                    [5, 3]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 1],
                eliminations: [
                    [3, 4, 1],
                    [5, 3, 7]
                ],
                reasonCells: [
                    [3, 4],
                    [4, 4],
                    [5, 3],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 1],
                eliminations: [
                    [3, 4, 1],
                    [3, 4, 5]
                ],
                reasonCells: [
                    [3, 3],
                    [3, 4],
                    [5, 3],
                    [5, 4]
                ]
            },
            {
                technique: SolutionTechniqueEnum.HiddenQuad,
                kind: 'elimination',
                result: [3, 4, 1],
                eliminations: [[3, 4, 1]],
                reasonCells: [
                    [3, 3],
                    [3, 4],
                    [4, 4],
                    [5, 3]
                ]
            }
        ]);
    });
});
