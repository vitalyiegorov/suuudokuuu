import type { PointInterface } from '../interfaces/point.interface';

export const projectPoint = (homography: Float64Array, x: number, y: number): PointInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const depth = h20 * x + h21 * y + h22;

    return { x: (h00 * x + h01 * y + h02) / depth, y: (h10 * x + h11 * y + h12) / depth };
};
