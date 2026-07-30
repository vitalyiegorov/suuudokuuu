import { GRID_CELL_COUNT } from './grid.constant';

export interface SolverConformanceCaseInterface {
    readonly name: string;
    readonly puzzle: string;
    readonly expectedCount: number;
}

export const UNIQUENESS_COUNT_LIMIT = 2;

const VALID_FULL_GRID = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';
const ROYLE_17 = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const MULTI_SOLUTION = ROYLE_17.replace('1', '0');
const INVALID_ROW = '55'.padEnd(GRID_CELL_COUNT, '0');
const EMPTY_GRID = '0'.repeat(GRID_CELL_COUNT);

export const solverConformanceCases: readonly SolverConformanceCaseInterface[] = [
    { name: 'complete valid grid has exactly one solution', puzzle: VALID_FULL_GRID, expectedCount: 1 },
    { name: '17-given minimal puzzle has exactly one solution', puzzle: ROYLE_17, expectedCount: 1 },
    {
        name: 'minimal puzzle with a removed given has two-plus solutions',
        puzzle: MULTI_SOLUTION,
        expectedCount: UNIQUENESS_COUNT_LIMIT
    },
    { name: 'contradictory givens have zero solutions', puzzle: INVALID_ROW, expectedCount: 0 },
    { name: 'empty grid hits the count limit', puzzle: EMPTY_GRID, expectedCount: UNIQUENESS_COUNT_LIMIT }
];
