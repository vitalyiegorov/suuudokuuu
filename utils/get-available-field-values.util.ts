import { isDefined } from '@rnw-community/shared';

import { BlankCellValueConstant } from '../constants/blank-cell-value.constant';
import { type FieldInterface } from '../interfaces/field.interface';

export const getAvailableFieldValues = (field: FieldInterface): Record<number, number> => {
    const availableValues: Record<string, number> = {};
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[x].length; y++) {
            const value = field[x][y].value;
            if (value !== BlankCellValueConstant) {
                availableValues[value] = isDefined(availableValues[value]) ? availableValues[value] + 1 : 1;
            }
        }
    }

    return availableValues;
};
