import type { ForcingContradictionType } from '../types/forcing-outcome.type';

export interface HypothesisPropagationInterface {
    readonly hasContradiction: boolean;
    readonly placedValues: Int8Array;
    readonly placedCellIndexes: number[];
    readonly eliminatedMasks: Uint16Array;
    readonly contradiction?: ForcingContradictionType;
}
