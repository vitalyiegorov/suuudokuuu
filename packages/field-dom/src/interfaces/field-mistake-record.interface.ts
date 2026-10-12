import type { FieldCellType } from '../types/field-cell.type';

export interface FieldMistakeRecordInterface {
    readonly cell: FieldCellType;
    readonly mistakes: number;
    readonly sudokuString: string;
}
