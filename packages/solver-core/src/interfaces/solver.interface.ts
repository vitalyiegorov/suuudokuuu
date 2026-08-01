export interface SolverInterface {
    solve(grid: Uint8Array): Uint8Array | null;
    countSolutions(grid: Uint8Array, limit: number): number;
}
