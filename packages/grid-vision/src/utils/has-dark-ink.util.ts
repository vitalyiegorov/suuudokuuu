import { CELL_SIZE, GRID_SIZE, LINE_BAND, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import type { GrayImageInterface } from '../interfaces/gray-image.interface';

const LINE_SIDE_OFFSET = LINE_BAND + 4;

const measureStripMean = (board: GrayImageInterface, position: number, isVertical: boolean): number => {
    const across = Math.min(Math.max(position, 0), WARPED_GRID_SIZE - 1);
    let sum = 0;

    for (let along = 0; along < WARPED_GRID_SIZE; along += 1) {
        sum += board.data[isVertical ? along * WARPED_GRID_SIZE + across : across * WARPED_GRID_SIZE + along];
    }

    return sum / WARPED_GRID_SIZE;
};

const measureLineDeviation = (board: GrayImageInterface, linePosition: number, isVertical: boolean): number => {
    const sides = [linePosition - LINE_SIDE_OFFSET, linePosition + LINE_SIDE_OFFSET].filter(
        position => position >= 0 && position < WARPED_GRID_SIZE
    );
    const side = sides.reduce((total, position) => total + measureStripMean(board, position, isVertical), 0) / sides.length;
    const deviations = Array.from(
        { length: 2 * LINE_BAND + 1 },
        (_, bandOffset) => measureStripMean(board, linePosition + bandOffset - LINE_BAND, isVertical) - side
    );

    return deviations.reduce((strongest, deviation) => (Math.abs(deviation) > Math.abs(strongest) ? deviation : strongest), 0);
};

export const hasDarkInk = (board: GrayImageInterface): boolean =>
    Array.from({ length: GRID_SIZE + 1 }, (_, line) => line * CELL_SIZE).reduce(
        (total, position) => total + measureLineDeviation(board, position, true) + measureLineDeviation(board, position, false),
        0
    ) <= 0;
