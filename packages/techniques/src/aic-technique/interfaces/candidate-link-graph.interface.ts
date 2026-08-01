import type { CandidateNodeInterface } from './candidate-node.interface';

export interface CandidateLinkGraphInterface {
    readonly nodesByKey: Map<string, CandidateNodeInterface>;
    readonly strongNeighborsByKey: Map<string, Set<string>>;
    readonly weakNeighborsByKey: Map<string, Set<string>>;
}
