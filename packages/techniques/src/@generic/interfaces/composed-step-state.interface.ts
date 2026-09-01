import type { CandidateContext } from '../classes/candidate-context/candidate-context';

export interface ComposedStepStateInterface {
    readonly context: CandidateContext;
    readonly hardestStrategyIndex: number;
}
