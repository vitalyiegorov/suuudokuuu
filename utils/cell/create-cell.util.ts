import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';

const getGroupValue = (x: number, y: number): number => Math.floor(x / 3) * 3 + Math.floor(y / 3) + 1;

export const createCell = (x: number, y: number, value = BlankCellValueContant) => ({ group: getGroupValue(x, y), value, x, y });
