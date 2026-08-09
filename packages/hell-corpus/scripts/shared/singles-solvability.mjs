import { GRID_CELL_COUNT } from '@suuudokuuu/solver-core';

const GRID_SIZE = 9;
const BOX_SIZE = 3;
const ALL_CANDIDATES_MASK = 0x1ff;

const buildUnitCells = () => {
    const units = [];

    for (let index = 0; index < GRID_SIZE; index += 1) {
        const rowCells = [];
        const columnCells = [];
        const boxCells = [];

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

const UNIT_CELLS = buildUnitCells();
const UNIT_POSITION_MASKS = new Uint16Array(GRID_SIZE);

const cellRow = cell => Math.floor(cell / GRID_SIZE);

const cellColumn = cell => cell % GRID_SIZE;

const cellBox = cell => Math.floor(cellRow(cell) / BOX_SIZE) * BOX_SIZE + Math.floor(cellColumn(cell) / BOX_SIZE);

const maskToIndex = mask => Math.log2(mask);

const maskToValue = mask => maskToIndex(mask) + 1;

const isSingleBit = mask => mask !== 0 && (mask & (mask - 1)) === 0;

const placeSinglesValue = (state, cell, value) => {
    const bit = 1 << (value - 1);

    state.values[cell] = value;
    state.rowMasks[cellRow(cell)] |= bit;
    state.columnMasks[cellColumn(cell)] |= bit;
    state.boxMasks[cellBox(cell)] |= bit;
    state.placedCount += 1;
};

const cellCandidates = (state, cell) => {
    if (state.values[cell] !== 0) {
        return 0;
    }

    const usedMask = state.rowMasks[cellRow(cell)] | state.columnMasks[cellColumn(cell)] | state.boxMasks[cellBox(cell)];

    return ALL_CANDIDATES_MASK & ~usedMask;
};

const createSinglesState = grid => {
    const state = {
        values: new Uint8Array(grid.length),
        rowMasks: new Uint16Array(GRID_SIZE),
        columnMasks: new Uint16Array(GRID_SIZE),
        boxMasks: new Uint16Array(GRID_SIZE),
        placedCount: 0
    };

    for (let cell = 0; cell < grid.length; cell += 1) {
        if (grid[cell] !== 0) {
            placeSinglesValue(state, cell, grid[cell]);
        }
    }

    return state;
};

const applyNakedSingles = state => {
    let hasPlaced = false;

    for (let cell = 0; cell < state.values.length; cell += 1) {
        const candidates = cellCandidates(state, cell);

        if (isSingleBit(candidates)) {
            placeSinglesValue(state, cell, maskToValue(candidates));
            hasPlaced = true;
        }
    }

    return hasPlaced;
};

const applyHiddenSinglesInUnit = (state, unitCells) => {
    let hasPlaced = false;

    UNIT_POSITION_MASKS.fill(0);

    unitCells.forEach((cell, position) => {
        let candidates = cellCandidates(state, cell);

        while (candidates !== 0) {
            const lowestBit = candidates & -candidates;

            UNIT_POSITION_MASKS[maskToIndex(lowestBit)] |= 1 << position;
            candidates ^= lowestBit;
        }
    });

    for (let valueIndex = 0; valueIndex < GRID_SIZE; valueIndex += 1) {
        const positionMask = UNIT_POSITION_MASKS[valueIndex];

        if (isSingleBit(positionMask)) {
            const cell = unitCells[maskToIndex(positionMask)];
            const isStillCandidate = (cellCandidates(state, cell) & (1 << valueIndex)) !== 0;

            if (isStillCandidate) {
                placeSinglesValue(state, cell, valueIndex + 1);
                hasPlaced = true;
            }
        }
    }

    return hasPlaced;
};

const applyHiddenSingles = state => {
    let hasPlaced = false;

    UNIT_CELLS.forEach(unitCells => {
        if (applyHiddenSinglesInUnit(state, unitCells)) {
            hasPlaced = true;
        }
    });

    return hasPlaced;
};

export const isSinglesSolvable = grid => {
    const state = createSinglesState(grid);
    let hasProgress = true;

    while (hasProgress && state.placedCount < GRID_CELL_COUNT) {
        hasProgress = applyNakedSingles(state) || applyHiddenSingles(state);
    }

    return state.placedCount === GRID_CELL_COUNT;
};
