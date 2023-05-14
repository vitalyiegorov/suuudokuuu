import { type CellValueType } from '../interfaces/cell-value.type';
import { type CellInterface } from '../interfaces/cell.interface';

export const createField = (size: number): CellInterface[][] => {
    const field: CellInterface[][] = [];
    for (let i = 0; i < size; i++) {
        const row: CellInterface[] = [];
        for (let j = 0; j < size; j++) {
            row.push({
                group: (Math.floor(i / 3) * 3 + Math.floor(j / 3) + 1) as CellValueType,
                value: 0,
                x: i,
                y: j
            });
        }
        field.push(row);
    }

    return field;
};
