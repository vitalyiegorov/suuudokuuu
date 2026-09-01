import type { CandidateNodeInterface } from './candidate-node.interface';

export interface CandidateLinkGraphInterface {
    readonly nodesByKey: Map<string, CandidateNodeInterface>;
    readonly weakNeighborNodesByIndex: CandidateNodeInterface[][];
    readonly sortedStrongNeighborsByIndex: CandidateNodeInterface[][];
    readonly sortedWeakNeighborsByIndex: CandidateNodeInterface[][];
    readonly nodeCount: number;
}
