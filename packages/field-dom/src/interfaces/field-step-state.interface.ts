export interface FieldStepStateInterface {
    patternCellKeys: ReadonlySet<string>;
    targetCellKey: string | null;
    revealedCandidates: ReadonlyMap<string, number[]>;
    eliminatedCandidates: ReadonlyMap<string, number[]>;
    placedValues: ReadonlyMap<string, number>;
}
