import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';

export const lineToGrid = line => Uint8Array.from(line, character => Number(character));

export const validatePuzzleFormat = (line, label) => {
    if (!/^[0-9]{81}$/u.test(line)) {
        return `${label}: expected ${GRID_CELL_COUNT} digits, received "${line}"`;
    }

    return null;
};

export const validateUniquePuzzle = (line, label, seenPuzzles, bitmaskSolver) => {
    if (seenPuzzles.has(line)) {
        return `${label}: duplicate puzzle`;
    }

    seenPuzzles.add(line);

    const solutionCount = bitmaskSolver.countSolutions(lineToGrid(line), UNIQUENESS_COUNT_LIMIT);

    if (solutionCount !== 1) {
        return `${label}: expected exactly one solution, BitmaskSolver found ${solutionCount}`;
    }

    return null;
};

export const crossCheckPuzzleLine = (line, label, dlxSolver) => {
    const solutionCount = dlxSolver.countSolutions(lineToGrid(line), UNIQUENESS_COUNT_LIMIT);

    if (solutionCount !== 1) {
        return `${label}: DLX cross-check expected exactly one solution, found ${solutionCount}`;
    }

    return null;
};
