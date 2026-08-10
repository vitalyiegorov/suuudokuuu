export interface HypothesisPropagationInterface {
    readonly hasContradiction: boolean;
    readonly placedValues: Int8Array;
    readonly placedCellIndexes: number[];
    readonly eliminatedMasks: Uint16Array;
}
