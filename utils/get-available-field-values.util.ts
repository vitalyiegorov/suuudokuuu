import { isDefined } from '@rnw-community/shared';

import { BlankCellValue } from '../interfaces/blank-cell-value';
import { type CellInterface } from '../interfaces/cell.interface';

export const getAvailableFieldValues = (field: CellInterface[][]): Record<number, number> => {
    const availableValues: Record<string, number> = {};
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[x].length; y++) {
            const value = field[x][y].value;
            if (value !== BlankCellValue) {
                availableValues[value] = isDefined(availableValues[value]) ? availableValues[value] + 1 : 1;
            }
        }
    }

    return availableValues;
};
