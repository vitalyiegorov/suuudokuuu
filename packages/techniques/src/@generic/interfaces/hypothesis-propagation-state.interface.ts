import type { ForcingContradictionType } from '../types/forcing-outcome.type';
import type { HypothesisPlacementsInterface } from './hypothesis-placements.interface';
import type { IndexedCandidateInterface } from './indexed-candidate.interface';

export interface HypothesisPropagationStateInterface extends HypothesisPlacementsInterface {
    masks: Uint16Array;
    pendingCellIndexes: number[];
    pendingValues: number[];
    pendingReasons: number[];
    contradiction?: ForcingContradictionType;
    contradictionEliminations?: IndexedCandidateInterface[];
}
