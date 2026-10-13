import { describe, expect, it } from 'vitest';

import { solverConformanceCases } from '../../src/testing/constants/solver-conformance-cases.constant';
import { collectSolverConformanceFailures } from '../../src/testing/utils/collect-solver-conformance-failures.util';

import type { SolverInterface } from '../../src/interfaces/solver.interface';

const brokenSolver: SolverInterface = { solve: () => null, countSolutions: () => 99 };
const mutatingSolver: SolverInterface = {
    solve: grid => {
        grid.fill(9);

        return grid;
    },
    countSolutions: grid => {
        grid.fill(9);

        return 99;
    }
};

describe('collectSolverConformanceFailures', () => {
    it('reports incorrect counts and missing solutions across the fixture set', () => {
        const failures = collectSolverConformanceFailures(brokenSolver);

        expect(failures.filter(failure => failure.includes('expected count'))).toHaveLength(solverConformanceCases.length);
        expect(failures.filter(failure => failure.includes('solve() returned null'))).toHaveLength(
            solverConformanceCases.filter(conformanceCase => conformanceCase.expectedCount > 0).length
        );
    });

    it('detects input mutation by both solver operations', () => {
        const failures = collectSolverConformanceFailures(mutatingSolver);

        expect(failures.filter(failure => failure.includes('mutated the input grid'))).toHaveLength(solverConformanceCases.length * 2);
    });
});
