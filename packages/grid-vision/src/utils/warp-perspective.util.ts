import type { GrayImageInterface } from '../interfaces/gray-image.interface';

const PIXEL_CENTER = 0.5;

const sampleBilinear = (image: GrayImageInterface, x: number, y: number): number => {
    const clampedX = Math.min(Math.max(x, 0), image.width - 1);
    const clampedY = Math.min(Math.max(y, 0), image.height - 1);
    const left = Math.floor(clampedX);
    const top = Math.floor(clampedY);
    const right = Math.min(left + 1, image.width - 1);
    const bottom = Math.min(top + 1, image.height - 1);
    const horizontalWeight = clampedX - left;
    const verticalWeight = clampedY - top;
    const topValue =
        image.data[top * image.width + left] * (1 - horizontalWeight) + image.data[top * image.width + right] * horizontalWeight;
    const bottomValue =
        image.data[bottom * image.width + left] * (1 - horizontalWeight) + image.data[bottom * image.width + right] * horizontalWeight;

    return topValue * (1 - verticalWeight) + bottomValue * verticalWeight;
};

export const warpPerspective = (image: GrayImageInterface, homography: Float64Array, size: number): GrayImageInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const data = new Float32Array(size * size);

    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            const targetX = x + PIXEL_CENTER;
            const targetY = y + PIXEL_CENTER;
            const depth = h20 * targetX + h21 * targetY + h22;
            const sourceX = (h00 * targetX + h01 * targetY + h02) / depth - PIXEL_CENTER;
            const sourceY = (h10 * targetX + h11 * targetY + h12) / depth - PIXEL_CENTER;

            data[y * size + x] = sampleBilinear(image, sourceX, sourceY);
        }
    }

    return { width: size, height: size, data };
};
