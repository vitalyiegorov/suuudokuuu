import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { NakedSingleTechnique } from './naked-single.technique';

describe('NakedSingleTechnique', () => {
    it('finds a blank cell with one candidate', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.3.678912',
            '672.95348',
            '1983425.7',
            '8597.142.',
            '.268537.1',
            '7.3924856',
            '961537284',
            '287419635',
            '34.286179'
        );
        const context = CandidateContext.fromSudoku(sudoku);

        expectTechniqueResults(context, new NakedSingleTechnique().find(context), [
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [1, 3, 1], eliminations: [], reasonCells: [[1, 3]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [2, 7, 6], eliminations: [], reasonCells: [[2, 7]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [3, 4, 6], eliminations: [], reasonCells: [[3, 4]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [3, 8, 3], eliminations: [], reasonCells: [[3, 8]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [4, 0, 4], eliminations: [], reasonCells: [[4, 0]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [4, 7, 9], eliminations: [], reasonCells: [[4, 7]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [5, 1, 1], eliminations: [], reasonCells: [[5, 1]] },
            { technique: SolutionTechniqueEnum.NakedSingle, kind: 'placement', result: [8, 2, 5], eliminations: [], reasonCells: [[8, 2]] }
        ]);
    });
});
