import type { FieldCellType } from '../types/field-cell.type';
import type { StepScriptStateInterface } from '@suuudokuuu/field-core';

export interface FieldCellViewContextInterface {
    givenCellKeys: ReadonlySet<string>;
    stepState: StepScriptStateInterface;
    selectedCell?: FieldCellType;
    mistakeCell?: FieldCellType;
}
