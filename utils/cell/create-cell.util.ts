import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { FieldGroupSizeConstant } from '../../constants/field.constant';

const getGroupValue = (x: number, y: number): number =>
    Math.floor(x / FieldGroupSizeConstant) * FieldGroupSizeConstant + Math.floor(y / FieldGroupSizeConstant) + 1;

export const createCell = (x: number, y: number, value = BlankCellValueConstant) => ({ group: getGroupValue(x, y), value, x, y });
