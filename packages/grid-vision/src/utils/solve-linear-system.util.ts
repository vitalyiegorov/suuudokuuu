const SINGULAR_PIVOT = 1e-10;

const findPivotRow = (equations: readonly (readonly number[])[], column: number): number => {
    let pivotRow = column;

    for (let row = column + 1; row < equations.length; row += 1) {
        if (Math.abs(equations[row][column]) > Math.abs(equations[pivotRow][column])) {
            pivotRow = row;
        }
    }

    return pivotRow;
};

const eliminateColumn = (equations: number[][], column: number): void => {
    for (let row = 0; row < equations.length; row += 1) {
        const factor = equations[row][column] / equations[column][column];

        if (row !== column && factor !== 0) {
            for (let entry = column; entry <= equations.length; entry += 1) {
                equations[row][entry] -= factor * equations[column][entry];
            }
        }
    }
};

export const solveLinearSystem = (equations: number[][]): number[] | null => {
    for (let column = 0; column < equations.length; column += 1) {
        const pivotRow = findPivotRow(equations, column);

        if (Math.abs(equations[pivotRow][column]) < SINGULAR_PIVOT) {
            return null;
        }

        [equations[column], equations[pivotRow]] = [equations[pivotRow], equations[column]];
        eliminateColumn(equations, column);
    }

    return equations.map((equation, row) => equation[equations.length] / equation[row]);
};
