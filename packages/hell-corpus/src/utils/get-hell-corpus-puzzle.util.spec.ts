import { describe, expect, it } from '@jest/globals';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_CELL_COUNT, UNIQUENESS_COUNT_LIMIT, parseGridString } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';

import { HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_CLUE_COUNT } from '../constants/hell-corpus.constant';

import { getHellCorpusPuzzle } from './get-hell-corpus-puzzle.util';

const SAMPLE_COUNT = 200;
const CROSS_CHECK_SAMPLE_COUNT = 25;
const SINGLES_SAMPLE_COUNT = 150;
const NEGATIVE_INDEX = -1;
const NON_INTEGER_INDEX = 1.5;
const EXPECTED_CORPUS_SIZE = 1544;
const GRID_SIZE = 9;
const BOX_SIZE = 3;
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const SINGLES_SOLVABLE_PUZZLE = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

const createUnitCells = (): number[][] => {
    const units: number[][] = [];

    for (let index = 0; index < GRID_SIZE; index += 1) {
        const rowCells: number[] = [];
        const columnCells: number[] = [];
        const boxCells: number[] = [];

        for (let offset = 0; offset < GRID_SIZE; offset += 1) {
            const boxRow = Math.floor(index / BOX_SIZE) * BOX_SIZE + Math.floor(offset / BOX_SIZE);
            const boxColumn = (index % BOX_SIZE) * BOX_SIZE + (offset % BOX_SIZE);

            rowCells.push(index * GRID_SIZE + offset);
            columnCells.push(offset * GRID_SIZE + index);
            boxCells.push(boxRow * GRID_SIZE + boxColumn);
        }

        units.push(rowCells, columnCells, boxCells);
    }

    return units;
};

const UNIT_CELLS = createUnitCells();

const collectCandidates = (grid: number[], cell: number): number[] => {
    const row = Math.floor(cell / GRID_SIZE);
    const column = cell % GRID_SIZE;
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxColumn = Math.floor(column / BOX_SIZE) * BOX_SIZE;
    const usedValues = new Set<number>();

    for (let offset = 0; offset < GRID_SIZE; offset += 1) {
        const boxCell = (boxRow + Math.floor(offset / BOX_SIZE)) * GRID_SIZE + boxColumn + (offset % BOX_SIZE);

        usedValues.add(grid[row * GRID_SIZE + offset]);
        usedValues.add(grid[offset * GRID_SIZE + column]);
        usedValues.add(grid[boxCell]);
    }

    return DIGITS.filter(digit => !usedValues.has(digit));
};

const placeNakedSingles = (grid: number[]): boolean => {
    let hasPlaced = false;

    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        if (grid[cell] === 0) {
            const candidates = collectCandidates(grid, cell);

            if (candidates.length === 1) {
                const [candidate] = candidates;

                grid[cell] = candidate;
                hasPlaced = true;
            }
        }
    }

    return hasPlaced;
};

const placeHiddenSingle = (grid: number[]): boolean => {
    for (const unitCells of UNIT_CELLS) {
        for (const digit of DIGITS) {
            const matchingCells = unitCells.filter(cell => grid[cell] === 0 && collectCandidates(grid, cell).includes(digit));

            if (matchingCells.length === 1) {
                grid[matchingCells[0]] = digit;

                return true;
            }
        }
    }

    return false;
};

const isSolvableWithSinglesOnly = (puzzle: string): boolean => {
    const grid = puzzle.split('').map(Number);
    let hasProgress = true;

    while (hasProgress) {
        hasProgress = placeNakedSingles(grid) || placeHiddenSingle(grid);
    }

    return grid.every(value => value !== 0);
};

const createSpreadIndices = (count: number): number[] => {
    const indices = new Set<number>([0, HELL_CORPUS_SIZE - 1]);

    for (let sample = 0; sample < count; sample += 1) {
        indices.add(Math.floor((sample * (HELL_CORPUS_SIZE - 1)) / (count - 1)));
    }

    return [...indices];
};

const countGivens = (puzzle: string): number => puzzle.split('').filter(character => character !== '0').length;

describe('getHellCorpusPuzzle', () => {
    it('reports a corpus of exactly 1544 puzzles', () => {
        expect(HELL_CORPUS_SIZE).toBe(EXPECTED_CORPUS_SIZE);
    });

    it('detects a singles-solvable puzzle with the local oracle', () => {
        expect(isSolvableWithSinglesOnly(SINGLES_SOLVABLE_PUZZLE)).toBe(true);
    });

    it.each(createSpreadIndices(SAMPLE_COUNT))('decodes a valid 17-clue, uniquely-solvable puzzle at index %i', index => {
        const puzzle = getHellCorpusPuzzle(index);
        const bitmaskSolver = new BitmaskSolver();

        expect(puzzle).toHaveLength(GRID_CELL_COUNT);
        expect(countGivens(puzzle)).toBe(HELL_CORPUS_CLUE_COUNT);
        expect(bitmaskSolver.countSolutions(parseGridString(puzzle), UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it.each(createSpreadIndices(SINGLES_SAMPLE_COUNT))('is not solvable with singles alone at index %i', index => {
        expect(isSolvableWithSinglesOnly(getHellCorpusPuzzle(index))).toBe(false);
    });

    it.each(createSpreadIndices(CROSS_CHECK_SAMPLE_COUNT))('agrees with DLXSolver at index %i', index => {
        const grid = parseGridString(getHellCorpusPuzzle(index));
        const dlxSolver = new DLXSolver();

        expect(dlxSolver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT)).toBe(1);
    });

    it('throws for a negative index', () => {
        expect(() => getHellCorpusPuzzle(NEGATIVE_INDEX)).toThrow();
    });

    it('throws for an index at the size boundary', () => {
        expect(() => getHellCorpusPuzzle(HELL_CORPUS_SIZE)).toThrow();
    });

    it('throws for a non-integer index', () => {
        expect(() => getHellCorpusPuzzle(NON_INTEGER_INDEX)).toThrow();
    });
});
