import { GRID_CELL_COUNT } from '@suuudokuuu/solver-core';

import type { SeededRandomType } from '@suuudokuuu/solver-core';

export const shuffledCellIndexes = (random: SeededRandomType): Uint8Array => {
    const cellIndexes = new Uint8Array(GRID_CELL_COUNT);
    for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
        cellIndexes[cell] = cell;
    }

    for (let position = GRID_CELL_COUNT - 1; position > 0; position -= 1) {
        const swapWith = Math.floor(random() * (position + 1));
        const stored = cellIndexes[position];
        cellIndexes[position] = cellIndexes[swapWith];
        cellIndexes[swapWith] = stored;
    }

    return cellIndexes;
};
