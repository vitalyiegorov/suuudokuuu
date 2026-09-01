import type { ComposedStepStateInterface } from './composed-step-state.interface';

export interface ComposedStepResultInterface extends ComposedStepStateInterface {
    readonly isResolved: boolean;
    readonly hasContradiction: boolean;
}
