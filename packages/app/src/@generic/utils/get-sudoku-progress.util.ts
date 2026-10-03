const SudokuBlankCell = '.';

export const getSudokuProgress = (sudokuString: string) => {
    const totalCells = sudokuString.length;
    const filledCells = sudokuString.split('').filter(cell => cell !== SudokuBlankCell).length;
    const percent = totalCells === 0 ? 0 : Math.round((filledCells / totalCells) * 100);

    return { filledCells, percent, totalCells };
};
