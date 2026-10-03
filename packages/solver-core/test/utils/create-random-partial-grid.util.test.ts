import { describe, expect, it } from 'vitest';

import { GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_SIZE } from '../../src/constants/grid.constant';
import { createRandomPartialGrid } from '../../src/utils/create-random-partial-grid.util';
import { createSeededRandom } from '../../src/utils/create-seeded-random.util';

const SEED = 7;

describe('createRandomPartialGrid', () => {
    it('returns an all-blank grid when no givens are requested', () => {
        const grid = createRandomPartialGrid(createSeededRandom(SEED), 0);

        expect(grid).toEqual(new Uint8Array(GRID_CELL_COUNT));
    });

    it('fills at most the requested number of cells with valid digits', () => {
        const targetGivensCount = 20;
        const grid = createRandomPartialGrid(createSeededRandom(SEED), targetGivensCount);

        const filledCellValues = Array.from(grid).filter(value => value !== GRID_BLANK_VALUE);

        expect(filledCellValues.length).toBeLessThanOrEqual(targetGivensCount);
        for (const value of filledCellValues) {
            expect(value).toBeGreaterThanOrEqual(1);
            expect(value).toBeLessThanOrEqual(GRID_SIZE);
        }
    });

    it('is deterministic for the same seed', () => {
        const first = createRandomPartialGrid(createSeededRandom(SEED), 30);
        const second = createRandomPartialGrid(createSeededRandom(SEED), 30);

        expect(first).toEqual(second);
    });
});
