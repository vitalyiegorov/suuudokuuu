import { GRID_CELL_COUNT } from '../constants/grid.constant';

export const isValidCellIndex = (index: number) => index >= 0 && index < GRID_CELL_COUNT;
