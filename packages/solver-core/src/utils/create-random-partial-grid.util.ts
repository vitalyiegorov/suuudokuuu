import { GRID_CELL_COUNT, GRID_SIZE } from '../constants/grid.constant';

import type { SeededRandomType } from './create-seeded-random.util';

export const createRandomPartialGrid = (random: SeededRandomType, targetGivensCount: number): Uint8Array => {
    const grid = new Uint8Array(GRID_CELL_COUNT);

    for (let given = 0; given < targetGivensCount; given += 1) {
        const cell = Math.floor(random() * GRID_CELL_COUNT);
        grid[cell] = 1 + Math.floor(random() * GRID_SIZE);
    }

    return grid;
};
