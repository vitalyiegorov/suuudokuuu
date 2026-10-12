import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT } from '../../constants/grid.constant';

import type { SolverConformanceCaseInterface } from '../interfaces/solver-conformance-case.interface';

const VALID_FULL_GRID = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';
const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const MULTI_SOLUTION = ROYLE_17.replace('1', '0');
const INVALID_ROW = '55'.padEnd(GRID_CELL_COUNT, '0');
const EMPTY_GRID = '0'.repeat(GRID_CELL_COUNT);
const DUPLICATE_GIVEN_IN_BOX = `7${'0'.repeat(9)}7${'0'.repeat(70)}`;
const UNSOLVABLE_PUZZLE = '130070000600195000098000060800060003400803001700020006060000280000419005000080079';
const TWENTY_SOLUTIONS_PUZZLE = '000000000000000000000000067859761423426853791713924856961537284287419605345286179';
const SIBLING_BUDGET_PUZZLE = '000006000006000100700100050000000000800010000090000000000260900002000600000301500';

export const solverConformanceCases: readonly SolverConformanceCaseInterface[] = [
    { name: 'complete valid grid has exactly one solution', puzzle: VALID_FULL_GRID, expectedCount: 1 },
    { name: '17-given minimal puzzle has exactly one solution', puzzle: ROYLE_17, expectedCount: 1 },
    {
        name: 'minimal puzzle with a removed given has two-plus solutions',
        puzzle: MULTI_SOLUTION,
        expectedCount: UNIQUENESS_COUNT_LIMIT
    },
    { name: 'contradictory givens have zero solutions', puzzle: INVALID_ROW, expectedCount: 0 },
    { name: 'duplicate givens confined to the same box have no solutions', puzzle: DUPLICATE_GIVEN_IN_BOX, expectedCount: 0 },
    { name: 'empty grid hits the count limit', puzzle: EMPTY_GRID, expectedCount: UNIQUENESS_COUNT_LIMIT },
    { name: 'unsolvable puzzle without conflicting givens has no solutions', puzzle: UNSOLVABLE_PUZZLE, expectedCount: 0 },
    { name: 'counting stops at one solution', puzzle: TWENTY_SOLUTIONS_PUZZLE, expectedCount: 1, limit: 1 },
    { name: 'counting stops at two solutions', puzzle: TWENTY_SOLUTIONS_PUZZLE, expectedCount: 2, limit: 2 },
    { name: 'counting stops at seven solutions', puzzle: TWENTY_SOLUTIONS_PUZZLE, expectedCount: 7, limit: 7 },
    { name: 'counting finds every solution below the limit', puzzle: TWENTY_SOLUTIONS_PUZZLE, expectedCount: 20, limit: 100 },
    { name: 'sibling branches respect the remaining budget', puzzle: SIBLING_BUDGET_PUZZLE, expectedCount: 2 }
];
