import { GRID_SIZE } from '../constants/grid.constant';

export const isValidCellValue = (value: number) => Number.isInteger(value) && value > 0 && value <= GRID_SIZE;
