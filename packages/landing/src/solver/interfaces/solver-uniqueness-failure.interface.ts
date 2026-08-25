export interface SolverUniquenessFailureInterface {
    kind: 'no-solution' | 'multiple-solutions' | 'solver-disagreement';
    bitmaskCount: number;
    dlxCount: number;
}
