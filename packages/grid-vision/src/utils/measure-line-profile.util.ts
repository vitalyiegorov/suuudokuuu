import { CELL_SIZE, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';

export const LINE_STRIP_LENGTH = WARPED_GRID_SIZE / 3;

export const measureLineProfile = (mask: BinaryImageInterface, isVertical: boolean, stripCenter: number): Float32Array => {
    const profile = new Float32Array(WARPED_GRID_SIZE);

    for (let position = 0; position < WARPED_GRID_SIZE; position += 1) {
        let runLength = 0;

        for (let along = stripCenter - LINE_STRIP_LENGTH / 2; along <= stripCenter + LINE_STRIP_LENGTH / 2; along += 1) {
            const isInk =
                along < stripCenter + LINE_STRIP_LENGTH / 2 &&
                mask.data[isVertical ? along * WARPED_GRID_SIZE + position : position * WARPED_GRID_SIZE + along] === 1;

            profile[position] += !isInk && runLength >= CELL_SIZE ? runLength : 0;
            runLength = isInk ? runLength + 1 : 0;
        }
    }

    return profile;
};
