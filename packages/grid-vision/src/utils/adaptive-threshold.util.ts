import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';

const buildIntegralImage = (image: GrayImageInterface): Float64Array => {
    const stride = image.width + 1;
    const integral = new Float64Array(stride * (image.height + 1));

    for (let y = 0; y < image.height; y += 1) {
        let rowSum = 0;

        for (let x = 0; x < image.width; x += 1) {
            rowSum += image.data[y * image.width + x];
            integral[(y + 1) * stride + x + 1] = integral[y * stride + x + 1] + rowSum;
        }
    }

    return integral;
};

export const adaptiveThreshold = (image: GrayImageInterface, radius: number, sensitivity: number): BinaryImageInterface => {
    const { width, height } = image;
    const stride = width + 1;
    const integral = buildIntegralImage(image);
    const data = new Uint8Array(width * height);

    for (let y = 0; y < height; y += 1) {
        const top = Math.max(0, y - radius);
        const bottom = Math.min(height, y + radius + 1);

        for (let x = 0; x < width; x += 1) {
            const left = Math.max(0, x - radius);
            const right = Math.min(width, x + radius + 1);
            const windowSum =
                integral[bottom * stride + right] -
                integral[top * stride + right] -
                integral[bottom * stride + left] +
                integral[top * stride + left];
            const isInk = image.data[y * width + x] * (right - left) * (bottom - top) < windowSum * (1 - sensitivity);

            data[y * width + x] = isInk ? 1 : 0;
        }
    }

    return { width, height, data };
};
