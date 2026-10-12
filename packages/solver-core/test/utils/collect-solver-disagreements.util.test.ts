import { describe, expect, it } from 'vitest';

import { GRID_CELL_COUNT } from '../../src/constants/grid.constant';
import { collectSolverDisagreements } from '../../src/testing/utils/collect-solver-disagreements.util';

import type { SolverInterface } from '../../src/interfaces/solver.interface';

const options = { iterations: 5, randomSeed: 11 };
const solvable: SolverInterface = { solve: () => new Uint8Array(GRID_CELL_COUNT), countSolutions: () => 1 };
const unsolvable: SolverInterface = { solve: () => null, countSolutions: () => 0 };

describe('collectSolverDisagreements', () => {
    it('accepts solvers that agree', () => {
        expect(collectSolverDisagreements(solvable, solvable, options)).toEqual([]);
    });

    it('reports both count and solvability disagreements for each seeded grid', () => {
        const disagreements = collectSolverDisagreements(solvable, unsolvable, options);

        expect(disagreements).toHaveLength(options.iterations * 2);
        expect(disagreements.filter(disagreement => disagreement.includes('counts differ'))).toHaveLength(options.iterations);
        expect(disagreements.filter(disagreement => disagreement.includes('solvability differs'))).toHaveLength(options.iterations);
        expect(collectSolverDisagreements(solvable, unsolvable, options)).toEqual(disagreements);
    });
});
