import { describe, expect, it } from 'vitest';

import { solveHomography } from '../../src/utils/solve-homography.util';
import { warpPerspective } from '../../src/utils/warp-perspective.util';

import type { PointInterface } from '../../src/interfaces/point.interface';

const PRECISION_DIGITS = 6;
const SQUARE: readonly PointInterface[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 }
];
const TILTED_QUAD: readonly PointInterface[] = [
    { x: 3, y: 2 },
    { x: 40, y: 7 },
    { x: 35, y: 45 },
    { x: 1, y: 30 }
];
const IMAGE_SIZE = 4;

const project = (homography: Float64Array, point: PointInterface): PointInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const depth = h20 * point.x + h21 * point.y + h22;

    return { x: (h00 * point.x + h01 * point.y + h02) / depth, y: (h10 * point.x + h11 * point.y + h12) / depth };
};

describe('solveHomography', () => {
    it('should map every source corner onto its target corner', () => {
        const homography = solveHomography(SQUARE, TILTED_QUAD);

        expect(homography).not.toBeNull();
        SQUARE.forEach((corner, index) => {
            const projected = project(homography ?? new Float64Array(), corner);

            expect(projected.x).toBeCloseTo(TILTED_QUAD[index].x, PRECISION_DIGITS);
            expect(projected.y).toBeCloseTo(TILTED_QUAD[index].y, PRECISION_DIGITS);
        });
    });

    it('should return null for collapsed corners', () => {
        expect(
            solveHomography(
                SQUARE,
                SQUARE.map(() => ({ x: 1, y: 1 }))
            )
        ).toBeNull();
    });

    it('should warp an image unchanged through the identity homography', () => {
        const data = Float32Array.from({ length: IMAGE_SIZE * IMAGE_SIZE }, (_, index) => index);
        const identity = solveHomography(SQUARE, SQUARE) ?? new Float64Array();

        expect(Array.from(warpPerspective({ width: IMAGE_SIZE, height: IMAGE_SIZE, data }, identity, IMAGE_SIZE).data)).toEqual(
            Array.from(data)
        );
    });
});
