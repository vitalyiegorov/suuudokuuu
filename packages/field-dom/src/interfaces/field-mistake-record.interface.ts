import type { FieldCellType } from '../types/field-cell.type';

export interface FieldMistakeRecordInterface {
    cell: FieldCellType;
    mistakes: number;
    sudokuString: string;
}
