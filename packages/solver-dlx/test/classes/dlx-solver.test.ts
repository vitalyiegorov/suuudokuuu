import { collectSolverConformanceFailures } from '@suuudokuuu/solver-core/testing';
import { describe, expect, it } from 'vitest';

import { DLXSolver } from '../../src/classes/dlx-solver';

describe('DLXSolver', () => {
    it('passes the shared solver conformance cases on the same reusable instance', () => {
        expect(collectSolverConformanceFailures(new DLXSolver())).toEqual([]);
    });
});
