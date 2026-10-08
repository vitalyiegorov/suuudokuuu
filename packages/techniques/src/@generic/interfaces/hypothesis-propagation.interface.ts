import type { ForcingImplicationType } from '../types/forcing-implication.type';
import type { ForcingContradictionType } from '../types/forcing-outcome.type';

export interface HypothesisPropagationInterface {
    readonly assumptionCellIndex: number;
    readonly assumptionValue: number;
    readonly hasContradiction: boolean;
    readonly placedValues: Int8Array;
    readonly placedCellIndexes: number[];
    readonly eliminatedMasks: Uint16Array;
    readonly implications?: readonly ForcingImplicationType[];
    readonly contradiction?: ForcingContradictionType;
}
