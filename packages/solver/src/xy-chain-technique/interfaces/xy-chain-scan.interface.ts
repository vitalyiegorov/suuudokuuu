import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../../@generic/interfaces/technique-search-target.interface';

export interface XYChainScanInterface {
    readonly context: CandidateContext;
    readonly eliminationValue: number;
    readonly results: TechniqueResultInterface[];
    readonly target?: TechniqueSearchTargetInterface;
    linkVisits: number;
    resultsAtStart: number;
}
