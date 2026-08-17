import type { CandidateLinkGraphInterface } from './candidate-link-graph.interface';
import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';

export interface AICScanInterface {
    readonly context: CandidateContext;
    readonly graph: CandidateLinkGraphInterface;
    readonly results: TechniqueResultInterface[];
    readonly target?: TechniqueSearchTargetInterface;
    linkVisits: number;
    hasTargetResult: boolean;
}
