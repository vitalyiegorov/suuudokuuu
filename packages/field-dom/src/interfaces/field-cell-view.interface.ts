import type { FieldCellType } from '../types/field-cell.type';

export interface FieldCellViewInterface {
    cell: FieldCellType;
    key: string;
    value: number;
    placedValue: number;
    candidates: number[];
    eliminatedCandidates: number[];
    isGiven: boolean;
    isSelected: boolean;
    isHighlighted: boolean;
    isSameValue: boolean;
    isWrong: boolean;
    isPatternCell: boolean;
    isTargetCell: boolean;
}
