import type { HardestPuzzleRowInterface } from '../interfaces/hardest-puzzle-row.interface';

const GRID_SIZE = 9;
const BLANK_CHARACTERS = new Set(['0', '.']);

const buildCellLabel = (row: number, column: number): string => `r${row + 1}c${column + 1}`;

const buildCellValue = (character: string | undefined): number => (BLANK_CHARACTERS.has(character ?? '0') ? 0 : Number(character));

export const parsePuzzleGivens = (givens: string): HardestPuzzleRowInterface[] =>
    Array.from({ length: GRID_SIZE }, (_, row) => ({
        index: row,
        cells: Array.from({ length: GRID_SIZE }, (_, column) => ({
            row,
            column,
            label: buildCellLabel(row, column),
            value: buildCellValue(givens[row * GRID_SIZE + column])
        }))
    }));
