import { CELL_SIZE, LINE_BAND, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';

const MINIMUM_STROKE_LENGTH = 1.2 * CELL_SIZE;
const MAXIMUM_DASH_GAP = 8;
const MINIMUM_DASH_INK_RATIO = 0.5;
const THICKNESS_QUANTILE = 0.25;
const THICKNESS_TOLERANCE = 2;

const measureThickness = (mask: BinaryImageInterface, index: number, across: number): number => {
    let before = index;
    let after = index;

    while (before - across >= 0 && mask.data[before - across] === 1 && index - before < CELL_SIZE * across) {
        before -= across;
    }

    while (after + across < mask.data.length && mask.data[after + across] === 1 && after - index < CELL_SIZE * across) {
        after += across;
    }

    return (after - before) / across + 1;
};

const markThinStroke = (mask: BinaryImageInterface, marked: Uint8Array, run: readonly number[], across: number): void => {
    const thicknesses = new Float32Array(run.length);

    for (let position = 0; position < run.length; position += 1) {
        thicknesses[position] = mask.data[run[position]] === 1 ? measureThickness(mask, run[position], across) : CELL_SIZE;
    }

    const limit = thicknesses.slice().sort()[Math.floor(THICKNESS_QUANTILE * thicknesses.length)] + THICKNESS_TOLERANCE;

    for (let position = 0; position < run.length; position += 1) {
        marked[run[position]] = thicknesses[position] <= limit ? mask.data[run[position]] : 0;
    }
};

const isNearGridLine = (position: number): boolean => {
    const offset = position % CELL_SIZE;

    return offset <= LINE_BAND || offset >= CELL_SIZE - LINE_BAND;
};

const listRun = (first: number, count: number, step: number): number[] =>
    Array.from({ length: count }, (_, offset) => first + offset * step);

const markLongRuns = (mask: BinaryImageInterface, marked: Uint8Array, line: number, step: number): void => {
    const origin = step === 1 ? line * WARPED_GRID_SIZE : line;
    let start = -1;
    let last = -1;
    let ink = 0;

    for (let along = 0; along <= WARPED_GRID_SIZE; along += 1) {
        const isInk = along < WARPED_GRID_SIZE && mask.data[origin + along * step] === 1;
        const isRunOver = start !== -1 && (along === WARPED_GRID_SIZE || (isInk && along - last > MAXIMUM_DASH_GAP));

        if (isRunOver && last - start + 1 >= MINIMUM_STROKE_LENGTH && ink >= MINIMUM_DASH_INK_RATIO * (last - start + 1)) {
            markThinStroke(mask, marked, listRun(origin + start * step, last - start + 1, step), step === 1 ? WARPED_GRID_SIZE : 1);
        }

        if (isRunOver || start === -1) {
            start = isInk ? along : -1;
        }

        ink = (isRunOver ? 0 : ink) + (isInk ? 1 : 0);
        last = isInk ? along : last;
    }
};

const keepCrossings = (mask: BinaryImageInterface, marked: Uint8Array, across: number): void => {
    for (let index = 0; index < marked.length; index += 1) {
        if (marked[index] === 1 && (index < across || marked[index - across] === 0)) {
            let end = index;

            while (end + across < marked.length && marked[end + across] === 1) {
                end += across;
            }

            const isCrossed =
                index >= across && end + across < marked.length && mask.data[index - across] === 1 && mask.data[end + across] === 1;

            if (isCrossed) {
                for (let position = index; position <= end; position += across) {
                    marked[position] = 0;
                }
            }
        }
    }
};

export const eraseAnnotationStrokes = (mask: BinaryImageInterface): BinaryImageInterface => {
    const rows = new Uint8Array(mask.data.length);
    const columns = new Uint8Array(mask.data.length);

    for (let line = 0; line < WARPED_GRID_SIZE; line += 1) {
        if (!isNearGridLine(line)) {
            markLongRuns(mask, rows, line, 1);
            markLongRuns(mask, columns, line, WARPED_GRID_SIZE);
        }
    }

    keepCrossings(mask, rows, WARPED_GRID_SIZE);
    keepCrossings(mask, columns, 1);

    const data = new Uint8Array(mask.data.length);

    for (let index = 0; index < data.length; index += 1) {
        data[index] = rows[index] === 1 || columns[index] === 1 ? 0 : mask.data[index];
    }

    return { ...mask, data };
};
