import type { FieldCellType } from '../types/field-cell.type';
import type { StepScriptStateInterface } from '@suuudokuuu/field-core';

export interface FieldCellViewContextInterface {
    readonly givenCellKeys: ReadonlySet<string>;
    readonly stepState: StepScriptStateInterface;
    readonly selectedCell?: FieldCellType;
    readonly mistakeCell?: FieldCellType;
}
