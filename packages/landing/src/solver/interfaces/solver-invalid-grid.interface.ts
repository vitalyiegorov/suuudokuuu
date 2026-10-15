import type { SolverConflictInterface } from './solver-conflict.interface';

export interface SolverInvalidGridInterface {
    readonly kind: 'invalid-grid';
    readonly conflict: SolverConflictInterface;
}
