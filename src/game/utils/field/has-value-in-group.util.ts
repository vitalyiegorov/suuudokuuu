import { type CellInterface } from '../../../@logic/interfaces/cell.interface';
import { type FieldInterface } from '../../../@logic/interfaces/field.interface';
import { FieldGroupHeightConstant, FieldGroupWidthConstant } from '../../constants/field.constant';

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
