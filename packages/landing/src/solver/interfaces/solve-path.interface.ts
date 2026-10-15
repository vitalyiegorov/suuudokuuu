import type { SolverStepInterface } from './solver-step.interface';

export interface SolvePathInterface {
    readonly steps: SolverStepInterface[];
    readonly revealedCellCount: number;
    readonly isStepLimitReached: boolean;
}
