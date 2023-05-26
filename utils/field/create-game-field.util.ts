import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { type FieldInterface } from '../../interfaces/field.interface';

const cloneField = (field: FieldInterface): FieldInterface => field.map(row => row.map(cell => ({ ...cell })));
const getRandomPosition = (field: FieldInterface): number => Math.floor(Math.random() * field.length);

export const createGameField = (originalField: FieldInterface, blankCellsCount: number): FieldInterface => {
    const newField = cloneField(originalField);

    for (let i = 0; i < blankCellsCount; i++) {
        newField[getRandomPosition(originalField)][getRandomPosition(originalField)].value = BlankCellValueConstant;
    }

    return newField;
};
