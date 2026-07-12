import { Sudoku } from '@suuudokuuu/generator';

export const pauseScreenGetProgress = (sudoku: Sudoku) => {
    const totalCells = sudoku.Field.reduce((count, row) => count + row.length, 0);
    const filledCells = sudoku.Field.reduce((count, row) => count + row.filter(cell => !sudoku.isBlankCell(cell)).length, 0);
    const percent = totalCells === 0 ? 0 : Math.round((filledCells / totalCells) * 100);

    return {
        filledCells,
        percent,
        totalCells
    };
};
