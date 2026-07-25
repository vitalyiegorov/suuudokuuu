import { GRID_SIZE } from '../constants/grid.constant';

export const isValidCellValue = (value: number) => value > 0 && value <= GRID_SIZE;
