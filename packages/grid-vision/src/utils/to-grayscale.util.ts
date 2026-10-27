import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';

const RGBA_CHANNEL_COUNT = 4;
const RED_LUMA_WEIGHT = 0.299;
const GREEN_LUMA_WEIGHT = 0.587;
const BLUE_LUMA_WEIGHT = 0.114;

const readLuma = (data: Uint8ClampedArray, pixelIndex: number): number => {
    const offset = pixelIndex * RGBA_CHANNEL_COUNT;

    return RED_LUMA_WEIGHT * data[offset] + GREEN_LUMA_WEIGHT * data[offset + 1] + BLUE_LUMA_WEIGHT * data[offset + 2];
};

const averageLuma = (image: RgbaImageInterface, scale: number, outputX: number, outputY: number): number => {
    const startX = Math.floor(outputX * scale);
    const endX = Math.max(startX + 1, Math.floor((outputX + 1) * scale));
    const startY = Math.floor(outputY * scale);
    const endY = Math.max(startY + 1, Math.floor((outputY + 1) * scale));
    let sum = 0;

    for (let sourceY = startY; sourceY < endY; sourceY += 1) {
        for (let sourceX = startX; sourceX < endX; sourceX += 1) {
            sum += readLuma(image.data, sourceY * image.width + sourceX);
        }
    }

    return sum / ((endX - startX) * (endY - startY));
};

export const toGrayscale = (image: RgbaImageInterface, maximumSide: number): GrayImageInterface => {
    const scale = Math.max(1, Math.max(image.width, image.height) / maximumSide);
    const width = Math.floor(image.width / scale);
    const height = Math.floor(image.height / scale);
    const data = new Float32Array(width * height);

    for (let outputY = 0; outputY < height; outputY += 1) {
        for (let outputX = 0; outputX < width; outputX += 1) {
            data[outputY * width + outputX] = averageLuma(image, scale, outputX, outputY);
        }
    }

    return { width, height, data };
};
