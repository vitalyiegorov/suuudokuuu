import type { CandidateContext } from '../../@generic/classes/candidate-context/candidate-context';
import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';

export interface XYChainScanInterface {
    readonly context: CandidateContext;
    readonly eliminationValue: number;
    readonly results: TechniqueResultInterface[];
}
