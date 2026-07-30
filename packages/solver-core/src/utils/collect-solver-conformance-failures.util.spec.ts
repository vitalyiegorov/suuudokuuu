import { describe, expect, it } from '@jest/globals';

import { isDefined } from '@rnw-community/shared';

import { UNIQUENESS_COUNT_LIMIT, solverConformanceCases } from '../constants/solver-conformance-cases.constant';

import { collectSolverConformanceFailures } from './collect-solver-conformance-failures.util';
import { formatGridString } from './format-grid-string.util';
import { parseGridString } from './parse-grid-string.util';

import type { SolverConformanceCaseInterface } from '../interfaces/solver-conformance-case.interface';
import type { SolverInterface } from '../interfaces/solver.interface';

const findConformanceCase = (name: string): SolverConformanceCaseInterface => {
    const conformanceCase = solverConformanceCases.find(candidate => candidate.name === name);
    if (!isDefined(conformanceCase)) {
        throw new Error(`Missing conformance case fixture: ${name}`);
    }

    return conformanceCase;
};

const VALID_FULL_GRID = findConformanceCase('complete valid grid has exactly one solution').puzzle;
const ROYLE_17_PUZZLE = findConformanceCase('17-given minimal puzzle has exactly one solution').puzzle;
const MULTI_SOLUTION_PUZZLE = findConformanceCase('minimal puzzle with a removed given has two-plus solutions').puzzle;
const INVALID_GIVENS_PUZZLE = findConformanceCase('contradictory givens have zero solutions').puzzle;
const EMPTY_GIVENS_PUZZLE = findConformanceCase('empty grid hits the count limit').puzzle;

const ROYLE_17_SOLUTION = '693784512487512936125963874932651487568247391741398625319475268856129743274836159';
const ROYLE_17_MISMATCHING_SOLUTION = '693784521487521936215963874931652487568147392742398615329475168856219743174836259';
const MULTI_SOLUTION_ANSWER = '865942173493761852127583964639258417548617329271394586386475291754129638912836745';
const INCOMPLETE_MULTI_SOLUTION_ANSWER = `0${MULTI_SOLUTION_ANSWER.slice(1)}`;
const EMPTY_GRID_SOLUTION = '123456789456789123789123456231674895875912364694538217317265948542897631968341572';

const solutionByPuzzle: Record<string, string | null> = {
    [VALID_FULL_GRID]: VALID_FULL_GRID,
    [ROYLE_17_PUZZLE]: ROYLE_17_SOLUTION,
    [MULTI_SOLUTION_PUZZLE]: MULTI_SOLUTION_ANSWER,
    [INVALID_GIVENS_PUZZLE]: null,
    [EMPTY_GIVENS_PUZZLE]: EMPTY_GRID_SOLUTION
};

const expectedCountByPuzzle: Record<string, number> = {
    [VALID_FULL_GRID]: 1,
    [ROYLE_17_PUZZLE]: 1,
    [MULTI_SOLUTION_PUZZLE]: UNIQUENESS_COUNT_LIMIT,
    [INVALID_GIVENS_PUZZLE]: 0,
    [EMPTY_GIVENS_PUZZLE]: UNIQUENESS_COUNT_LIMIT
};

const createBrokenSolver = (): SolverInterface => ({
    solve: () => null,
    countSolutions: () => 99
});

const createFullyCorrectSolver = (): SolverInterface => ({
    solve: grid => {
        const solution = solutionByPuzzle[formatGridString(grid)];

        return isDefined(solution) ? parseGridString(solution) : null;
    },
    countSolutions: grid => expectedCountByPuzzle[formatGridString(grid)]
});

describe('collectSolverConformanceFailures', () => {
    it('reports every case for a broken solver', () => {
        const failures = collectSolverConformanceFailures(createBrokenSolver());

        expect(failures.length).toBeGreaterThanOrEqual(5);
    });

    it('reports no failures for a solver that matches every conformance case', () => {
        expect(collectSolverConformanceFailures(createFullyCorrectSolver())).toEqual([]);
    });

    it('flags a case whose solve() omits a required solution', () => {
        const baseSolver = createFullyCorrectSolver();
        const solverMissingRoyleSolution: SolverInterface = {
            ...baseSolver,
            solve: grid => (formatGridString(grid) === ROYLE_17_PUZZLE ? null : baseSolver.solve(grid))
        };

        expect(collectSolverConformanceFailures(solverMissingRoyleSolution)).toEqual([
            '17-given minimal puzzle has exactly one solution: solve() returned null'
        ]);
    });

    it('flags a case whose solve() returns an incomplete grid', () => {
        const baseSolver = createFullyCorrectSolver();
        const solverWithIncompleteMultiSolutionAnswer: SolverInterface = {
            ...baseSolver,
            solve: grid =>
                formatGridString(grid) === MULTI_SOLUTION_PUZZLE
                    ? parseGridString(INCOMPLETE_MULTI_SOLUTION_ANSWER)
                    : baseSolver.solve(grid)
        };

        expect(collectSolverConformanceFailures(solverWithIncompleteMultiSolutionAnswer)).toEqual([
            'minimal puzzle with a removed given has two-plus solutions: solve() returned an incomplete or invalid grid'
        ]);
    });

    it('flags a case whose solve() disagrees with a given digit', () => {
        const baseSolver = createFullyCorrectSolver();
        const solverWithMismatchingRoyleSolution: SolverInterface = {
            ...baseSolver,
            solve: grid =>
                formatGridString(grid) === ROYLE_17_PUZZLE ? parseGridString(ROYLE_17_MISMATCHING_SOLUTION) : baseSolver.solve(grid)
        };

        expect(collectSolverConformanceFailures(solverWithMismatchingRoyleSolution)).toEqual([
            '17-given minimal puzzle has exactly one solution: solve() result does not match the puzzle givens'
        ]);
    });

    it('flags a case that expects zero solutions but solve() returns one', () => {
        const baseSolver = createFullyCorrectSolver();
        const solverWithSpuriousInvalidSolution: SolverInterface = {
            ...baseSolver,
            solve: grid => (formatGridString(grid) === INVALID_GIVENS_PUZZLE ? parseGridString(VALID_FULL_GRID) : baseSolver.solve(grid))
        };

        expect(collectSolverConformanceFailures(solverWithSpuriousInvalidSolution)).toEqual([
            'contradictory givens have zero solutions: expected no solution from solve()'
        ]);
    });

    it('flags a case whose solution count disagrees with the expected count', () => {
        const baseSolver = createFullyCorrectSolver();
        const solverWithWrongEmptyGridCount: SolverInterface = {
            ...baseSolver,
            countSolutions: (grid, limit) => (formatGridString(grid) === EMPTY_GIVENS_PUZZLE ? 1 : baseSolver.countSolutions(grid, limit))
        };

        expect(collectSolverConformanceFailures(solverWithWrongEmptyGridCount)).toEqual([
            `empty grid hits the count limit: expected count ${UNIQUENESS_COUNT_LIMIT}, received 1`
        ]);
    });
});
