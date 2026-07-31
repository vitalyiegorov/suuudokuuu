import type { HellCandidateInterface } from './hell-candidate.interface';

export interface HellAdvanceResultInterface {
    readonly candidate?: HellCandidateInterface;
    readonly steps: number;
}
