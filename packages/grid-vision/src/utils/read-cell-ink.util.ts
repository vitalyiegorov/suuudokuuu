import {
    BLUE_LUMA_WEIGHT,
    CELL_SIZE,
    GREEN_LUMA_WEIGHT,
    GRID_SIZE,
    PIXEL_CENTER,
    RED_LUMA_WEIGHT,
    RGBA_CHANNEL_COUNT,
    WARPED_GRID_SIZE
} from '../constants/grid-vision.constant';

import { extractCellGlyph } from './extract-cell-glyph.util';
import { projectPoint } from './project-point.util';

import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { WarpedBoardInterface } from '../interfaces/warped-board.interface';

const CORE_INK_RATIO = 0.5;
const BACKGROUND_INSET = 10;

const readSourcePixel = (image: RgbaImageInterface, homography: Float64Array, x: number, y: number) => {
    const source = projectPoint(homography, x + PIXEL_CENTER, y + PIXEL_CENTER);
    const sourceX = Math.min(image.width - 1, Math.max(0, Math.floor(source.x)));
    const sourceY = Math.min(image.height - 1, Math.max(0, Math.floor(source.y)));
    const offset = (sourceY * image.width + sourceX) * RGBA_CHANNEL_COUNT;
    const red = image.data[offset];
    const green = image.data[offset + 1];
    const blue = image.data[offset + 2];

    return {
        luma: RED_LUMA_WEIGHT * red + GREEN_LUMA_WEIGHT * green + BLUE_LUMA_WEIGHT * blue,
        chroma: Math.max(red, green, blue) - Math.min(red, green, blue)
    };
};

const measureBackgroundChroma = (image: RgbaImageInterface, board: WarpedBoardInterface, cell: number): number => {
    const originX = (cell % GRID_SIZE) * CELL_SIZE + BACKGROUND_INSET;
    const originY = Math.floor(cell / GRID_SIZE) * CELL_SIZE + BACKGROUND_INSET;
    const chromas: number[] = [];

    for (let y = originY; y < originY + CELL_SIZE - 2 * BACKGROUND_INSET; y += 1) {
        for (let x = originX; x < originX + CELL_SIZE - 2 * BACKGROUND_INSET; x += 1) {
            if (board.mask.data[y * WARPED_GRID_SIZE + x] === 0) {
                chromas.push(readSourcePixel(image, board.homography, x, y).chroma);
            }
        }
    }

    return chromas.sort((first, second) => first - second)[Math.floor(chromas.length / 2)] ?? 0;
};

export const readCellInk = (image: RgbaImageInterface, board: WarpedBoardInterface, cell: number) => {
    const pixels: ReturnType<typeof readSourcePixel>[] = [];
    const extracted = extractCellGlyph(board.mask, Math.floor(cell / GRID_SIZE), cell % GRID_SIZE, (x, y) => {
        pixels.push(readSourcePixel(image, board.homography, x, y));
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
        chroma: Math.max(
            0,
            core.reduce((total, pixel) => total + pixel.chroma, 0) / core.length - measureBackgroundChroma(image, board, cell)
        )
    };
};
