import { FieldGroupHeightConstant, FieldGroupWidthConstant } from '../../../game/constants/field.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

/** @deprecated */
export const hasValueInGroup = (cell: CellInterface, field: FieldInterface): boolean => {
    const boxStartY = cell.y - (cell.y % FieldGroupHeightConstant);
    const boxStartX = cell.x - (cell.x % FieldGroupWidthConstant);

    for (let y = 0; y < FieldGroupHeightConstant; y++) {
        for (let x = 0; x < FieldGroupWidthConstant; x++) {
            if (field[y + boxStartY][x + boxStartX].value === cell.value) {
                return true;
            }
        }
    }

    return false;
};
