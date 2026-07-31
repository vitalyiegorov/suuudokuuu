import type { HellCandidateInterface } from './hell-candidate.interface';

export interface HellGeneratorOptionsInterface {
    readonly randomSeed: number;
    readonly minGivens: number;
    readonly maxGivens: number;
    readonly tabuCapacity: number;
    readonly candidateGate?: (candidate: HellCandidateInterface) => boolean;
}
