import { WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import type { GridRegionInterface } from '../interfaces/grid-region.interface';
import type { PointInterface } from '../interfaces/point.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';

const CLOSER_BOARD_SIDE = 1.2 * WARPED_GRID_SIZE;
const MINIMUM_CLOSER_GAIN = 1.15;
const CLOSER_MARGIN_RATIO = 0.12;

export const findCloserRegion = (
    corners: readonly PointInterface[],
    image: Pick<RgbaImageInterface, 'height' | 'width'>,
    sourceScale: number
): GridRegionInterface | null => {
    const boardSide =
        corners.reduce((total, corner, index) => {
            const next = corners[(index + 1) % corners.length];

            return total + Math.hypot(next.x - corner.x, next.y - corner.y);
        }, 0) / corners.length;

    if (Math.min(boardSide * sourceScale, CLOSER_BOARD_SIDE) < boardSide * MINIMUM_CLOSER_GAIN) {
        return null;
    }

    const left = Math.min(...corners.map(corner => corner.x));
    const right = Math.max(...corners.map(corner => corner.x));
    const top = Math.min(...corners.map(corner => corner.y));
    const bottom = Math.max(...corners.map(corner => corner.y));
    const x = Math.max(0, left - CLOSER_MARGIN_RATIO * (right - left));
    const y = Math.max(0, top - CLOSER_MARGIN_RATIO * (bottom - top));

    return {
        x: x / image.width,
        y: y / image.height,
        width: (Math.min(image.width, right + CLOSER_MARGIN_RATIO * (right - left)) - x) / image.width,
        height: (Math.min(image.height, bottom + CLOSER_MARGIN_RATIO * (bottom - top)) - y) / image.height
    };
};
