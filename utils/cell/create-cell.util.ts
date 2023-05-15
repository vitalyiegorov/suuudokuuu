import { BlankCellValue } from '../../constants/blank-cell-value';

const getGroupValue = (x: number, y: number): number => Math.floor(x / 3) * 3 + Math.floor(y / 3) + 1;

export const createCell = (x: number, y: number, value = BlankCellValue) => ({ group: getGroupValue(x, y), value, x, y });
