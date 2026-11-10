import { CELL_COUNT, CELL_SIZE, GRID_SIZE, LINE_BAND, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import { adaptiveThreshold } from './adaptive-threshold.util';
import { extractCellGlyph } from './extract-cell-glyph.util';
import { findGridCorners } from './find-grid-corners.util';
import { fitGridCorners } from './fit-grid-corners.util';
import { keepThinInk } from './keep-thin-ink.util';
import { solveHomography } from './solve-homography.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';

const MAXIMUM_IMAGE_SIDE = 640;
const MAXIMUM_GRAY = 255;
const RGBA_CHANNEL_COUNT = 4;
const RED_LUMA_WEIGHT = 0.299;
const GREEN_LUMA_WEIGHT = 0.587;
const BLUE_LUMA_WEIGHT = 0.114;
const PIXEL_CENTER = 0.5;
const INK_CONTRAST = 30;
const CELL_THRESHOLD_RADIUS = 12;
const CELL_THRESHOLD_SENSITIVITY = 0.15;
const MINIMUM_LINE_CONTRAST = 0.25;
const PENCIL_MARK_HEIGHT_RATIO = 0.6;
const VISIBLE_INSET = 1;
const INNER_BOX_LINE_POSITIONS = [WARPED_GRID_SIZE / 3, (2 * WARPED_GRID_SIZE) / 3];
const WARPED_TARGET_CORNERS: readonly PointInterface[] = [
    { x: 0, y: 0 },
    { x: WARPED_GRID_SIZE, y: 0 },
    { x: WARPED_GRID_SIZE, y: WARPED_GRID_SIZE },
    { x: 0, y: WARPED_GRID_SIZE }
];

const averageLuma = (image: RgbaImageInterface, scale: number, outputX: number, outputY: number): number => {
    const startX = Math.floor(outputX * scale);
    const endX = Math.max(startX + 1, Math.floor((outputX + 1) * scale));
    const startY = Math.floor(outputY * scale);
    const endY = Math.max(startY + 1, Math.floor((outputY + 1) * scale));
    let sum = 0;

    for (let sourceY = startY; sourceY < endY; sourceY += 1) {
        for (let sourceX = startX; sourceX < endX; sourceX += 1) {
            const offset = (sourceY * image.width + sourceX) * RGBA_CHANNEL_COUNT;

            sum +=
                RED_LUMA_WEIGHT * image.data[offset] +
                GREEN_LUMA_WEIGHT * image.data[offset + 1] +
                BLUE_LUMA_WEIGHT * image.data[offset + 2];
        }
    }

    return sum / ((endX - startX) * (endY - startY));
};

const toGrayscale = (image: RgbaImageInterface): GrayImageInterface => {
    const scale = Math.max(1, Math.max(image.width, image.height) / MAXIMUM_IMAGE_SIDE);
    const width = Math.floor(image.width / scale);
    const height = Math.floor(image.height / scale);
    const data = new Float32Array(width * height);

    for (let index = 0; index < data.length; index += 1) {
        data[index] = averageLuma(image, scale, index % width, Math.floor(index / width));
    }

    return { width, height, data };
};

const hasDarkInk = (board: GrayImageInterface): boolean => {
    const histogram = new Uint32Array(MAXIMUM_GRAY + 1);
    let median = 0;
    let darkerCount = 0;

    for (const value of board.data) {
        histogram[Math.round(value)] += 1;
    }

    while (darkerCount + histogram[median] < board.data.length / 2) {
        darkerCount += histogram[median];
        median += 1;
    }

    const darkTail = histogram.slice(0, Math.max(0, median - INK_CONTRAST)).reduce((total, count) => total + count, 0);
    const brightTail = histogram.slice(Math.min(MAXIMUM_GRAY + 1, median + INK_CONTRAST + 1)).reduce((total, count) => total + count, 0);

    return darkTail >= brightTail;
};

const invertGray = (image: GrayImageInterface): GrayImageInterface => ({ ...image, data: image.data.map(value => MAXIMUM_GRAY - value) });

const sampleBilinear = (image: GrayImageInterface, x: number, y: number): number => {
    const clampedX = Math.min(Math.max(x, 0), image.width - 1);
    const clampedY = Math.min(Math.max(y, 0), image.height - 1);
    const left = Math.floor(clampedX);
    const top = Math.floor(clampedY);
    const right = Math.min(left + 1, image.width - 1);
    const bottom = Math.min(top + 1, image.height - 1);
    const horizontalWeight = clampedX - left;
    const topValue =
        image.data[top * image.width + left] * (1 - horizontalWeight) + image.data[top * image.width + right] * horizontalWeight;
    const bottomValue =
        image.data[bottom * image.width + left] * (1 - horizontalWeight) + image.data[bottom * image.width + right] * horizontalWeight;

    return topValue * (1 - (clampedY - top)) + bottomValue * (clampedY - top);
};

const projectPoint = (homography: Float64Array, x: number, y: number): PointInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const depth = h20 * x + h21 * y + h22;

    return { x: (h00 * x + h01 * y + h02) / depth, y: (h10 * x + h11 * y + h12) / depth };
};

const projectWarpedPixel = (homography: Float64Array, index: number): PointInterface =>
    projectPoint(homography, (index % WARPED_GRID_SIZE) + PIXEL_CENTER, Math.floor(index / WARPED_GRID_SIZE) + PIXEL_CENTER);

const warpBoard = (gray: GrayImageInterface, homography: Float64Array): GrayImageInterface => {
    const data = new Float32Array(WARPED_GRID_SIZE * WARPED_GRID_SIZE);

    for (let index = 0; index < data.length; index += 1) {
        const source = projectWarpedPixel(homography, index);

        data[index] = sampleBilinear(gray, source.x - PIXEL_CENTER, source.y - PIXEL_CENTER);
    }

    return { width: WARPED_GRID_SIZE, height: WARPED_GRID_SIZE, data };
};

const measureLineCoverage = (mask: BinaryImageInterface, linePosition: number, isVertical: boolean): number => {
    let coveredCount = 0;

    for (let along = 0; along < WARPED_GRID_SIZE; along += 1) {
        let isCovered = false;

        for (let across = linePosition - LINE_BAND; across <= linePosition + LINE_BAND && !isCovered; across += 1) {
            isCovered = mask.data[isVertical ? along * WARPED_GRID_SIZE + across : across * WARPED_GRID_SIZE + along] === 1;
        }

        coveredCount += isCovered ? 1 : 0;
    }

    return coveredCount / WARPED_GRID_SIZE;
};

const measureLineContrast = (mask: BinaryImageInterface, linePosition: number, isVertical: boolean): number => {
    const clampedPosition = Math.min(Math.max(linePosition, LINE_BAND), WARPED_GRID_SIZE - 1 - LINE_BAND);
    const cellCenter = clampedPosition + (clampedPosition < WARPED_GRID_SIZE / 2 ? CELL_SIZE / 2 : -CELL_SIZE / 2);

    return measureLineCoverage(mask, clampedPosition, isVertical) - measureLineCoverage(mask, cellCenter, isVertical);
};

const scoreBoard = (mask: BinaryImageInterface): number => {
    const hasBoxLines = INNER_BOX_LINE_POSITIONS.every(
        position =>
            measureLineContrast(mask, position, true) >= MINIMUM_LINE_CONTRAST &&
            measureLineContrast(mask, position, false) >= MINIMUM_LINE_CONTRAST
    );
    const linePositions = Array.from({ length: GRID_SIZE + 1 }, (_, line) => line * CELL_SIZE);

    return hasBoxLines
        ? linePositions.reduce(
              (total, position) => total + measureLineContrast(mask, position, true) + measureLineContrast(mask, position, false),
              0
          )
        : -Infinity;
};

const readBoard = (gray: GrayImageInterface, corners: readonly PointInterface[], knownIsDarkInk: boolean | null = null) => {
    const homography = solveHomography(WARPED_TARGET_CORNERS, corners);

    if (homography === null) {
        return null;
    }

    const board = warpBoard(gray, homography);
    const isDarkInk = knownIsDarkInk ?? hasDarkInk(board);

    return {
        corners,
        homography,
        isDarkInk,
        mask: adaptiveThreshold(isDarkInk ? board : invertGray(board), CELL_THRESHOLD_RADIUS, CELL_THRESHOLD_SENSITIVITY)
    };
};

const refineBoard = (gray: GrayImageInterface, board: NonNullable<ReturnType<typeof readBoard>> | null) =>
    board === null
        ? null
        : readBoard(
              gray,
              fitGridCorners(keepThinInk(board.mask, LINE_BAND)).map(corner => projectPoint(board.homography, corner.x, corner.y)),
              board.isDarkInk
          );

const readFusedBoard = (gray: GrayImageInterface, corners: readonly PointInterface[]) => {
    const board = refineBoard(gray, refineBoard(gray, readBoard(gray, corners)));
    const left = Math.min(...corners.map(corner => corner.x)) + VISIBLE_INSET;
    const right = Math.max(...corners.map(corner => corner.x)) - VISIBLE_INSET;
    const top = Math.min(...corners.map(corner => corner.y)) + VISIBLE_INSET;
    const bottom = Math.max(...corners.map(corner => corner.y)) - VISIBLE_INSET;

    return board === null
        ? null
        : {
              ...board,
              mask: {
                  ...board.mask,
                  data: board.mask.data.map((value, index) => {
                      const { x, y } = projectWarpedPixel(board.homography, index);

                      return x < left || x > right || y < top || y > bottom ? 0 : value;
                  })
              }
          };
};

const findBestBoardMask = (gray: GrayImageInterface, isInvertedSearch: boolean, isFusedSearch: boolean) =>
    findGridCorners(isInvertedSearch ? invertGray(gray) : gray, isFusedSearch)
        .map(corners => (isFusedSearch ? readFusedBoard(gray, corners) : readBoard(gray, corners)))
        .filter(board => board !== null)
        .map(board => ({ ...board, score: scoreBoard(board.mask) }))
        .filter(board => board.score > -Infinity)
        .reduce<{
            readonly mask: BinaryImageInterface;
            readonly homography: Float64Array;
            readonly isDarkInk: boolean;
            readonly score: number;
        } | null>((best, board) => (best === null || board.score > best.score ? board : best), null);

const readCellInk = (image: RgbaImageInterface, homography: Float64Array, mask: BinaryImageInterface, cell: number) => {
    const scale = Math.max(1, Math.max(image.width, image.height) / MAXIMUM_IMAGE_SIDE);
    let luma = 0;
    let chroma = 0;
    let count = 0;
    const extracted = extractCellGlyph(mask, Math.floor(cell / GRID_SIZE), cell % GRID_SIZE, (x, y) => {
        const source = projectPoint(homography, x + PIXEL_CENTER, y + PIXEL_CENTER);
        const sourceX = Math.min(image.width - 1, Math.max(0, Math.floor(scale * source.x)));
        const sourceY = Math.min(image.height - 1, Math.max(0, Math.floor(scale * source.y)));
        const offset = (sourceY * image.width + sourceX) * RGBA_CHANNEL_COUNT;
        const red = image.data[offset];
        const green = image.data[offset + 1];
        const blue = image.data[offset + 2];

        luma += RED_LUMA_WEIGHT * red + GREEN_LUMA_WEIGHT * green + BLUE_LUMA_WEIGHT * blue;
        chroma += Math.max(red, green, blue) - Math.min(red, green, blue);
        count += 1;
    });

    return extracted === null ? null : { ...extracted, luma: luma / count, chroma: chroma / count };
};

export const readGridGlyphs = (image: RgbaImageInterface) => {
    if (image.width <= 0 || image.height <= 0 || image.data.length < image.width * image.height * RGBA_CHANNEL_COUNT) {
        return null;
    }

    const gray = toGrayscale(image);
    const board =
        findBestBoardMask(gray, false, false) ??
        findBestBoardMask(gray, true, false) ??
        findBestBoardMask(gray, false, true) ??
        findBestBoardMask(gray, true, true);

    if (board === null) {
        return null;
    }

    const cells = Array.from({ length: CELL_COUNT }, (_, cell) => readCellInk(image, board.homography, board.mask, cell));
    const strokeHeights = cells
        .filter(ink => ink !== null)
        .map(ink => ink.strokeHeight)
        .sort((first, second) => first - second);
    const minimumStrokeHeight = PENCIL_MARK_HEIGHT_RATIO * (strokeHeights[Math.floor(strokeHeights.length / 2)] ?? 0);

    return cells.map(ink =>
        ink === null || ink.strokeHeight < minimumStrokeHeight
            ? null
            : { glyph: ink.glyph, chroma: ink.chroma, luma: board.isDarkInk ? ink.luma : MAXIMUM_GRAY - ink.luma }
    );
};
