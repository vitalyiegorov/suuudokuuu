import type { ForcingOutcomeType } from '../types/forcing-outcome.type';
import type { CandidateEliminationInterface } from './candidate-elimination.interface';

export interface ForcingBranchInterface {
    readonly assumption: CandidateEliminationInterface;
    readonly implications: readonly CandidateEliminationInterface[];
    readonly outcome: ForcingOutcomeType;
}
