import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { GuessTechniqueScanner } from './guess-technique.scanner';

describe('GuessTechniqueScanner', () => {
    const emptyFieldString = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);

    it('should mark the move as a guess with the correct value', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const scanner = new GuessTechniqueScanner(sudoku);
        const [[cell]] = sudoku.Field;
        const correctValue = sudoku.getCorrectValue(cell);

        expect(scanner.findForCell(cell)).toEqual({
            technique: SolutionTechniqueEnum.Guess,
            cell,
            value: correctValue,
            kind: 'guess',
            eliminations: [],
            reasonCells: [cell]
        });
    });

    it('should reference the guessed cell as the only reason cell', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromString(emptyFieldString, defaultSudokuConfig);
        const scanner = new GuessTechniqueScanner(sudoku);
        const [[, cell]] = sudoku.Field;
        const result = scanner.findForCell(cell);

        expect(result.reasonCells).toEqual([cell]);
        expect(result.eliminations).toEqual([]);
    });
});
