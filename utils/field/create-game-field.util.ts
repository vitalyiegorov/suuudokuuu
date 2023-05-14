import { BlankCellValue } from '../../interfaces/blank-cell-value';
import { type CellInterface } from '../../interfaces/cell.interface';

const cloneField = (field: CellInterface[][]): CellInterface[][] => field.map(row => row.map(cell => ({ ...cell })));
const getRandomPosition = (field: CellInterface[][]): number => Math.floor(Math.random() * field.length);

export const createGameField = (originalField: CellInterface[][], blankCellsCount: number): CellInterface[][] => {
    const newField = cloneField(originalField);

    for (let i = 0; i < blankCellsCount; i++) {
        newField[getRandomPosition(originalField)][getRandomPosition(originalField)].value = BlankCellValue;
    }

    return newField;
};
