import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { BivalueUniversalGraveTechnique } from './bivalue-universal-grave.technique';

describe('BivalueUniversalGraveTechnique', () => {
    it('places the candidate that appears three times in the units of the only non bivalue cell', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '386179452',
            '7..654938',
            '4..328176',
            '.6.947315',
            '934215867',
            '.7.836294',
            '643581729',
            '...762543',
            '..7493681'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new BivalueUniversalGraveTechnique().find(context), [
            {
                technique: SolutionTechniqueEnum.BivalueUniversalGrave,
                kind: 'placement',
                result: [7, 2, 1],
                eliminations: [],
                reasonCells: [
                    [1, 2],
                    [5, 2],
                    [7, 0],
                    [7, 1],
                    [7, 2]
                ]
            }
        ]);
    });

    it('ignores a single non bivalue cell whose candidates are not tripled in its units', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.7..26415',
            '.26..1987',
            '..19.7236',
            '..4692751',
            '197..5642',
            '652714893',
            '7..169524',
            '469253178',
            '215478369'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new BivalueUniversalGraveTechnique().find(context)).toEqual([]);
    });

    it('ignores a board that holds more than one non bivalue cell', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '891673254',
            '743125869',
            '625489137',
            '937...412',
            '268714395',
            '514932678',
            '186297543',
            '3.2.4.98.',
            '4.93..7..'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expect(new BivalueUniversalGraveTechnique().find(context)).toEqual([]);
    });
});
