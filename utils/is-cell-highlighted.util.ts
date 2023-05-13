import { type CellInterface } from '../interfaces/cell.interface';

export const isCellHighlighted = (activeCell: CellInterface, cell: CellInterface): boolean => {
    return activeCell.x === cell.x || activeCell.y === cell.y || activeCell.group === cell.group;
};
