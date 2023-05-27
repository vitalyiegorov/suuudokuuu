import { BlankCellValueConstant } from '../constants/blank-cell-value.constant';
import { FieldGroupHeightConstant, FieldGroupWidthConstant } from '../constants/field.constant';

const getGroupValue = (x: number, y: number): number =>
    Math.floor(x / FieldGroupWidthConstant) * FieldGroupWidthConstant + Math.floor(y / FieldGroupHeightConstant) + 1;

export const createCell = (x: number, y: number, value = BlankCellValueConstant) => ({ group: getGroupValue(x, y), value, x, y });
