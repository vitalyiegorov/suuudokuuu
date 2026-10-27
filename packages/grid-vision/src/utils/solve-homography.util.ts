import type { PointInterface } from '../interfaces/point.interface';

const UNKNOWN_COUNT = 8;
const AUGMENTED_WIDTH = UNKNOWN_COUNT + 1;
const SINGULAR_PIVOT = 1e-10;

const buildEquations = (source: readonly PointInterface[], target: readonly PointInterface[]): number[][] =>
    source.flatMap((point, index) => {
        const { x, y } = point;
        const projected = target[index];

        return [
            [x, y, 1, 0, 0, 0, -projected.x * x, -projected.x * y, projected.x],
            [0, 0, 0, x, y, 1, -projected.y * x, -projected.y * y, projected.y]
        ];
    });

const findPivotRow = (equations: readonly (readonly number[])[], column: number): number => {
    let pivotRow = column;

    for (let row = column + 1; row < UNKNOWN_COUNT; row += 1) {
        if (Math.abs(equations[row][column]) > Math.abs(equations[pivotRow][column])) {
            pivotRow = row;
        }
    }

    return pivotRow;
};

const eliminateColumn = (equations: number[][], column: number): void => {
    for (let row = 0; row < UNKNOWN_COUNT; row += 1) {
        const factor = equations[row][column] / equations[column][column];

        if (row !== column && factor !== 0) {
            for (let entry = column; entry < AUGMENTED_WIDTH; entry += 1) {
                equations[row][entry] -= factor * equations[column][entry];
            }
        }
    }
};

export const solveHomography = (source: readonly PointInterface[], target: readonly PointInterface[]): Float64Array | null => {
    const equations = buildEquations(source, target);

    for (let column = 0; column < UNKNOWN_COUNT; column += 1) {
        const pivotRow = findPivotRow(equations, column);

        if (Math.abs(equations[pivotRow][column]) < SINGULAR_PIVOT) {
            return null;
        }

        [equations[column], equations[pivotRow]] = [equations[pivotRow], equations[column]];
        eliminateColumn(equations, column);
    }

    return Float64Array.from([...equations.map((equation, row) => equation[UNKNOWN_COUNT] / equation[row]), 1]);
};
