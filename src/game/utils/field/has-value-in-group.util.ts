import { FieldGroupSizeConstant } from '../../constants/field.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';

export const hasValueInGroup = (cell: CellInterface, field: FieldInterface): boolean => {
    const boxStartY = cell.y - (cell.y % FieldGroupSizeConstant);
    const boxStartX = cell.x - (cell.x % FieldGroupSizeConstant);

    for (let row = 0; row < FieldGroupSizeConstant; row++) {
        for (let col = 0; col < FieldGroupSizeConstant; col++) {
            if (field[row + boxStartY][col + boxStartX].value === cell.value) {
                return true;
            }
        }
    }

    return false;
};
