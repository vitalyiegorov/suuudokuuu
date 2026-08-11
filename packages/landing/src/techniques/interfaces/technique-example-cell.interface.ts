export interface TechniqueExampleCellInterface {
    row: number;
    column: number;
    label: string;
    value: number;
    placedValue: number;
    candidates: number[];
    eliminatedCandidates: number[];
    isPatternCell: boolean;
    isTargetCell: boolean;
}
