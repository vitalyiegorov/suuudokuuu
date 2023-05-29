import { BlankCellValueConstant, FieldGroupHeightConstant, FieldGroupWidthConstant, FieldSizeConstant } from '../../game';

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
