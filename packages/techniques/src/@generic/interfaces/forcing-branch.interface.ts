import type { ForcingImplicationType } from '../types/forcing-implication.type';
import type { ForcingOutcomeType } from '../types/forcing-outcome.type';
import type { CandidateEliminationInterface } from './candidate-elimination.interface';

export interface ForcingBranchInterface {
    readonly assumption: Readonly<CandidateEliminationInterface>;
    readonly implications: readonly ForcingImplicationType[];
    readonly outcome: ForcingOutcomeType;
}
