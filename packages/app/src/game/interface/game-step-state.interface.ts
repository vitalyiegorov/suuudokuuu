export interface GameStepStateInterface {
    readonly patternCellKeys: ReadonlySet<string>;
    readonly targetCellKey: string | null;
    readonly revealedCandidates: ReadonlyMap<string, number[]>;
    readonly eliminatedCandidates: ReadonlyMap<string, number[]>;
}
