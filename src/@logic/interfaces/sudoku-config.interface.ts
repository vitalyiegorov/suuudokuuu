import { BlankCellValueConstant } from '../constants/blank-cell-value.constant';
import { FieldGroupHeightConstant, FieldGroupWidthConstant, FieldSizeConstant } from '../constants/field.constant';

export interface SudokuConfigInterface {
    fieldSize: number;
    fieldGroupWidth: number;
    fieldGroupHeight: number;
    blankCellValue: number;
}

export const defaultSudokuConfig: SudokuConfigInterface = {
    fieldSize: FieldSizeConstant,
    fieldGroupWidth: FieldGroupWidthConstant,
    fieldGroupHeight: FieldGroupHeightConstant,
    blankCellValue: BlankCellValueConstant
};
