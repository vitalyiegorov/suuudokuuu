import type { FieldStepStateInterface } from './field-step-state.interface';
import type { FieldCellType } from '../types/field-cell.type';

export interface FieldCellViewContextInterface {
    givenCellKeys: ReadonlySet<string>;
    stepState: FieldStepStateInterface;
    selectedCell?: FieldCellType;
    mistakeCell?: FieldCellType;
}
