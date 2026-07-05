import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { GuessTechnique } from './guess.technique';

describe('GuessTechnique', () => {
    const emptyFieldString = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);

    it('marks the move as a guess with the correct value', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const technique = new GuessTechnique(sudoku);
        const [[cell]] = sudoku.Field;
        const correctValue = sudoku.getCorrectValue(cell);

        expect(technique.findForCell(cell)).toEqual({
            technique: SolutionTechniqueEnum.Guess,
            cell,
            value: correctValue,
            kind: 'guess',
            eliminations: [],
            reasonCells: [cell]
        });
    });

    it('references the guessed cell as the only reason cell', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const technique = new GuessTechnique(sudoku);
        const [[, cell]] = sudoku.Field;
        const result = technique.findForCell(cell);

        expect(result.reasonCells).toEqual([cell]);
        expect(result.eliminations).toEqual([]);
    });
});
