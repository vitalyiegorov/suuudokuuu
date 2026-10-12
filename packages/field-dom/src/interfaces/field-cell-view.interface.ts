import type { FieldCellType } from '../types/field-cell.type';

export interface FieldCellViewInterface {
    readonly cell: FieldCellType;
    readonly key: string;
    readonly value: number;
    readonly placedValue: number;
    readonly candidates: number[];
    readonly eliminatedCandidates: number[];
    readonly isGiven: boolean;
    readonly isSelected: boolean;
    readonly isHighlighted: boolean;
    readonly isSameValue: boolean;
    readonly isWrong: boolean;
    readonly isPatternCell: boolean;
    readonly isTargetCell: boolean;
}
