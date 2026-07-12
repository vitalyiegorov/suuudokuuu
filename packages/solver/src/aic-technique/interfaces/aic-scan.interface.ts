import type { CandidateLinkGraphInterface } from './candidate-link-graph.interface';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';

export interface AICScanInterface {
    readonly graph: CandidateLinkGraphInterface;
    readonly results: TechniqueResultInterface[];
    readonly target?: TechniqueSearchTargetInterface;
    linkVisits: number;
    hasTargetResult: boolean;
}
