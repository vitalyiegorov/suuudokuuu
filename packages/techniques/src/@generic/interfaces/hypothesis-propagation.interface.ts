import type { ForcingContradictionType } from '../types/forcing-outcome.type';
import type { HypothesisPlacementsInterface } from './hypothesis-placements.interface';
import type { IndexedCandidateInterface } from './indexed-candidate.interface';

export interface HypothesisPropagationInterface extends HypothesisPlacementsInterface {
    readonly hasContradiction: boolean;
    readonly eliminatedMasks: Uint16Array;
    readonly contradiction?: ForcingContradictionType;
    readonly contradictionEliminations: IndexedCandidateInterface[];
}
