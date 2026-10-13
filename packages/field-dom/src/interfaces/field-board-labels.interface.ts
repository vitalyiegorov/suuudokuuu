import type { FieldCellType } from '../types/field-cell.type';

export interface FieldBoardLabelsInterface {
    readonly board: string;
    readonly cell: (cell: FieldCellType) => string;
}
