import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';

import { GuessTechnique } from './guess.technique';

describe('GuessTechnique', () => {
    const emptyFieldString = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);

    it('marks the move as a guess with the correct value', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const technique = new GuessTechnique(sudoku);
        const [[cell]] = sudoku.Field;
        const correctValue = sudoku.getCorrectValue(cell);

        expectTechniqueResults(
            CandidateContext.fromSudoku(sudoku),
            [technique.findForCell(cell)],
            [
                {
                    technique: SolutionTechniqueEnum.Guess,
                    kind: 'guess',
                    result: [0, 0, correctValue],
                    eliminations: [],
                    reasonCells: [[0, 0]]
                }
            ]
        );
    });

    it('references the guessed cell as the only reason cell', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const technique = new GuessTechnique(sudoku);
        const [[, cell]] = sudoku.Field;
        const correctValue = sudoku.getCorrectValue(cell);

        expectTechniqueResults(
            CandidateContext.fromSudoku(sudoku),
            [technique.findForCell(cell)],
            [
                {
                    technique: SolutionTechniqueEnum.Guess,
                    kind: 'guess',
                    result: [0, 1, correctValue],
                    eliminations: [],
                    reasonCells: [[0, 1]]
                }
            ]
        );
    });
});
