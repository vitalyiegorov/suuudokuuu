import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { createCandidateContextFromMap } from '../../@generic/test-utils/create-candidate-context-from-map.spec.util';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';
import { isForcedPlacement } from '../../@generic/utils/is-forced-placement.util';
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

        expectTechniqueResults(context, new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context), [
            {
                technique: SolutionTechniqueEnum.XWing,
                kind: 'elimination',
                result: [3, 1, 6],
                eliminations: [[3, 1, 6]],
                reasonCells: [
                    [3, 2],
                    [3, 4],
                    [4, 2],
                    [4, 4]
                ]
            }
        ]);
    });

    it('forces a hidden single one elimination step away', () => {
        expect.assertions(3);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.1.36..4.',
            '.3..5....',
            '24.9....8',
            '829..5..6',
            '453.26...',
            '761.39...',
            '68.29...1',
            '.925.....',
            '.746..9..'
        );
        const context = CandidateContext.fromSudoku(sudoku);
        const [targetCell] = sudoku.Field[6].slice(5);
        const results = new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context);
        const baseRowFish = results.find(result => result.reasonCells.every(cell => cell.y === 2 || cell.y === 3));

        expect(baseRowFish?.reasonCells.map(cell => [cell.y, cell.x])).toEqual([
            [2, 6],
            [2, 7],
            [3, 6],
            [3, 7]
        ]);
        expect(baseRowFish?.eliminations.map(elimination => [elimination.cell.y, elimination.cell.x, elimination.value])).toEqual(
            expect.arrayContaining([
                [6, 6, 3],
                [6, 7, 3]
            ])
        );
        expect(isForcedPlacement(context.withEliminations(baseRowFish?.eliminations ?? []), targetCell, 3)).toBe(true);
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
        expectTechniqueResults(context, new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }).find(context), [
            {
                technique: SolutionTechniqueEnum.XWing,
                kind: 'elimination',
                result: [6, 0, 5],
                eliminations: [[6, 0, 5]],
                reasonCells: [
                    [0, 0],
                    [0, 3],
                    [3, 0],
                    [3, 3]
                ]
            }
        ]);
    });
});
