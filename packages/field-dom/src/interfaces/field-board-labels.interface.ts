import type { FieldCellType } from '../types/field-cell.type';

export interface FieldBoardLabelsInterface {
    board: string;
    cell: (cell: FieldCellType) => string;
}
