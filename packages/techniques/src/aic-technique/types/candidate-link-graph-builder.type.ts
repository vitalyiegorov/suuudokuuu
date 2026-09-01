import type { CandidateNodeInterface } from '../interfaces/candidate-node.interface';

export type CandidateLinkGraphBuilderType = {
    readonly nodesByKey: Map<string, CandidateNodeInterface>;
    readonly strongNeighborsByKey: Map<string, Set<string>>;
    readonly weakNeighborsByKey: Map<string, Set<string>>;
};
