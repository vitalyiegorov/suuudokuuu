import type { CandidateLinkGraphInterface } from './candidate-link-graph.interface';
import type { CandidateNodeInterface } from './candidate-node.interface';
import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';

export interface AICScanInterface {
    readonly context: CandidateContext;
    readonly graph: CandidateLinkGraphInterface;
    readonly results: TechniqueResultInterface[];
    readonly target?: TechniqueSearchTargetInterface;
    readonly targetCellNodes: readonly CandidateNodeInterface[];
    readonly sortedStrongNeighborsByIndex: CandidateNodeInterface[][];
    readonly sortedWeakNeighborsByIndex: CandidateNodeInterface[][];
    readonly path: CandidateNodeInterface[];
    readonly firstWeakNeighborNodes: readonly CandidateNodeInterface[];
    readonly onPathByNodeIndex: Uint8Array;
    readonly endpointMarksByNodeIndex: Uint8Array;
    linkVisits: number;
    hasTargetResult: boolean;
}
