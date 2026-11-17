import {
    BLUE_LUMA_WEIGHT,
    CELL_SIZE,
    GREEN_LUMA_WEIGHT,
    GRID_SIZE,
    MAXIMUM_GRAY,
    PIXEL_CENTER,
    RED_LUMA_WEIGHT,
    RGBA_CHANNEL_COUNT,
    WARPED_GRID_SIZE
} from '../constants/grid-vision.constant';

import { extractCellGlyph } from './extract-cell-glyph.util';

import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { WarpedBoardInterface } from '../interfaces/warped-board.interface';

const CORE_INK_RATIO = 0.5;
const BACKGROUND_INSET = 10;

const locateSourcePixel = (image: RgbaImageInterface, homography: Float64Array, x: number, y: number): number => {
    const warpedX = x + PIXEL_CENTER;
    const warpedY = y + PIXEL_CENTER;
    const depth = homography[6] * warpedX + homography[7] * warpedY + homography[8];
    const sourceX = Math.floor((homography[0] * warpedX + homography[1] * warpedY + homography[2]) / depth);
    const sourceY = Math.floor((homography[3] * warpedX + homography[4] * warpedY + homography[5]) / depth);

    return (
        (Math.min(image.height - 1, Math.max(0, sourceY)) * image.width + Math.min(image.width - 1, Math.max(0, sourceX))) *
        RGBA_CHANNEL_COUNT
    );
};

const readChroma = ({ data }: RgbaImageInterface, offset: number): number =>
    Math.max(data[offset], data[offset + 1], data[offset + 2]) - Math.min(data[offset], data[offset + 1], data[offset + 2]);

const measureBackgroundChroma = (image: RgbaImageInterface, board: WarpedBoardInterface, cell: number): number => {
    const originX = (cell % GRID_SIZE) * CELL_SIZE + BACKGROUND_INSET;
    const originY = Math.floor(cell / GRID_SIZE) * CELL_SIZE + BACKGROUND_INSET;
    const pixelCountByChroma = new Uint16Array(MAXIMUM_GRAY + 1);
    let pixelCount = 0;

    for (let y = originY; y < originY + CELL_SIZE - 2 * BACKGROUND_INSET; y += 1) {
        for (let x = originX; x < originX + CELL_SIZE - 2 * BACKGROUND_INSET; x += 1) {
            if (board.mask.data[y * WARPED_GRID_SIZE + x] === 0) {
                pixelCountByChroma[readChroma(image, locateSourcePixel(image, board.homography, x, y))] += 1;
                pixelCount += 1;
            }
        }
    }

    let median = 0;
    let countedPixelCount = 0;

    for (let chroma = 0; chroma <= MAXIMUM_GRAY && countedPixelCount <= pixelCount / 2; chroma += 1) {
        countedPixelCount += pixelCountByChroma[chroma];
        median = chroma;
    }

    return pixelCount === 0 ? 0 : median;
};

export const readCellInk = (image: RgbaImageInterface, board: WarpedBoardInterface, cell: number) => {
    const pixels: { luma: number; chroma: number }[] = [];
    const extracted = extractCellGlyph(board, Math.floor(cell / GRID_SIZE), cell % GRID_SIZE, (x, y) => {
        const offset = locateSourcePixel(image, board.homography, x, y);

        pixels.push({
            luma:
                RED_LUMA_WEIGHT * image.data[offset] +
                GREEN_LUMA_WEIGHT * image.data[offset + 1] +
                BLUE_LUMA_WEIGHT * image.data[offset + 2],
            chroma: readChroma(image, offset)
        });
    });

    if (extracted === null) {
        return null;
    }

    const core = pixels
        .sort((first, second) => (board.isDarkInk ? first.luma - second.luma : second.luma - first.luma))
        .slice(0, Math.ceil(CORE_INK_RATIO * pixels.length));

    return {
        ...extracted,
        luma: core.reduce((total, pixel) => total + pixel.luma, 0) / core.length,
        chroma: core.reduce((total, pixel) => total + pixel.chroma, 0) / core.length,
        backgroundChroma: measureBackgroundChroma(image, board, cell)
    };
};
