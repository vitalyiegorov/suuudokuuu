import type { CandidateLinkGraphInterface } from './candidate-link-graph.interface';
import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';

export interface AICScanInterface {
    readonly context: CandidateContext;
    readonly graph: CandidateLinkGraphInterface;
    readonly resultKeys: Set<string>;
    readonly results: TechniqueResultInterface[];
}
