import { GRID_CELL_COUNT } from '../constants/grid.constant';

export const isValidCellIndex = (index: number) => Number.isInteger(index) && index >= 0 && index < GRID_CELL_COUNT;
