import type { TechniqueResultInterface } from './technique-result.interface';
import type { TechniqueSearchScopeInterface } from './technique-search-scope.interface';
import type { CandidateContext } from '../classes/candidate-context/candidate-context';
import type { HypothesisPropagator } from '../classes/hypothesis-propagator/hypothesis-propagator';

export interface ForcingChainScanInterface {
    readonly context: CandidateContext;
    readonly propagator: HypothesisPropagator;
    readonly scope: TechniqueSearchScopeInterface;
    readonly results: TechniqueResultInterface[];
    readonly propagationKeys: Set<number>;
}
