import { createCanvas } from '@napi-rs/canvas';
import jpeg from 'jpeg-js';

import type { GridRegionInterface } from '../../src/interfaces/grid-region.interface';
import type { RgbaImageInterface } from '../../src/interfaces/rgba-image.interface';
import type { Canvas } from '@napi-rs/canvas';

const MAXIMUM_READ_SIDE = 768;

export const WHOLE_IMAGE_REGION: GridRegionInterface = { x: 0, y: 0, width: 1, height: 1 };

export const readCanvasRegion = (source: Canvas, region: GridRegionInterface, isSmooth: boolean, quality: number): RgbaImageInterface => {
    const width = Math.max(1, Math.round(region.width * source.width));
    const height = Math.max(1, Math.round(region.height * source.height));
    const scale = Math.min(1, MAXIMUM_READ_SIDE / Math.max(width, height));
    const canvas = createCanvas(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
    const context = canvas.getContext('2d');

    context.imageSmoothingEnabled = isSmooth;
    context.imageSmoothingQuality = 'high';
    context.drawImage(
        source,
        Math.round(region.x * source.width),
        Math.round(region.y * source.height),
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const decoded = jpeg.decode(canvas.encodeSync('jpeg', quality), { useTArray: true, formatAsRGBA: true });

    return { width: decoded.width, height: decoded.height, data: new Uint8ClampedArray(decoded.data.buffer) };
};
