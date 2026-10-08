import type { ForcingContradictionType } from '../types/forcing-outcome.type';

export interface HypothesisPropagationStateInterface {
    masks: Uint16Array;
    placedValues: Int8Array;
    placedCellIndexes: number[];
    pendingCellIndexes: number[];
    pendingValues: number[];
    contradiction?: ForcingContradictionType;
}
