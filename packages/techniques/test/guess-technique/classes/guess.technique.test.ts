import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { describe, expect, it } from 'vitest';

import { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import { SolutionTechniqueEnum } from '../../../src/@generic/enums/solution-technique.enum';
import { GuessTechnique } from '../../../src/guess-technique/classes/guess.technique';
import { expectTechniqueResults } from '../../@generic/test-utils/expect-technique-results.spec.util';


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
