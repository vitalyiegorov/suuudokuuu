import { CELL_COUNT, CELL_SIZE, GRID_SIZE, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import { adaptiveThreshold } from './adaptive-threshold.util';
import { extractCellGlyph } from './extract-cell-glyph.util';
import { findGridCorners } from './find-grid-corners.util';
import { solveHomography } from './solve-homography.util';
import { toGrayscale } from './to-grayscale.util';
import { warpPerspective } from './warp-perspective.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';

const MAXIMUM_IMAGE_SIDE = 640;
const MAXIMUM_GRAY = 255;
const INK_CONTRAST = 30;
const CELL_THRESHOLD_RADIUS = 12;
const CELL_THRESHOLD_SENSITIVITY = 0.15;
const LINE_BAND = 4;
const MINIMUM_LINE_COVERAGE = 0.5;
const MINIMUM_LINE_CONTRAST = 0.25;
const MAXIMUM_INK_RATIO = 0.3;
const INNER_BOX_LINE_POSITIONS = [WARPED_GRID_SIZE / 3, (2 * WARPED_GRID_SIZE) / 3];
const WARPED_TARGET_CORNERS: readonly PointInterface[] = [
    { x: 0, y: 0 },
    { x: WARPED_GRID_SIZE, y: 0 },
    { x: WARPED_GRID_SIZE, y: WARPED_GRID_SIZE },
    { x: 0, y: WARPED_GRID_SIZE }
];

const invertGray = (image: GrayImageInterface): GrayImageInterface => ({ ...image, data: image.data.map(value => MAXIMUM_GRAY - value) });

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

const isGridLine = (mask: BinaryImageInterface, linePosition: number, isVertical: boolean): boolean =>
    measureLineCoverage(mask, linePosition, isVertical) >= MINIMUM_LINE_COVERAGE &&
    measureLineContrast(mask, linePosition, isVertical) >= MINIMUM_LINE_CONTRAST;

const scoreBoard = (mask: BinaryImageInterface): number => {
    const hasBoxLines = INNER_BOX_LINE_POSITIONS.every(position => isGridLine(mask, position, true) && isGridLine(mask, position, false));
    const isSparse = mask.data.reduce((total, value) => total + value, 0) <= MAXIMUM_INK_RATIO * mask.data.length;
    const linePositions = Array.from({ length: GRID_SIZE + 1 }, (_, line) => line * CELL_SIZE);

    return hasBoxLines && isSparse
        ? linePositions.reduce(
              (total, position) => total + measureLineContrast(mask, position, true) + measureLineContrast(mask, position, false),
              0
          )
        : -Infinity;
};

const warpBoardMask = (gray: GrayImageInterface, corners: readonly PointInterface[]): BinaryImageInterface | null => {
    const homography = solveHomography(WARPED_TARGET_CORNERS, corners);

    if (homography === null) {
        return null;
    }

    const warped = warpPerspective(gray, homography, WARPED_GRID_SIZE);

    return adaptiveThreshold(hasDarkInk(warped) ? warped : invertGray(warped), CELL_THRESHOLD_RADIUS, CELL_THRESHOLD_SENSITIVITY);
};

const findBestBoardMask = (gray: GrayImageInterface): BinaryImageInterface | null =>
    findGridCorners(gray)
        .map(corners => warpBoardMask(gray, corners))
        .filter(mask => mask !== null)
        .map(mask => ({ mask, score: scoreBoard(mask) }))
        .filter(board => board.score > -Infinity)
        .reduce<{ mask: BinaryImageInterface; score: number } | null>(
            (best, board) => (best === null || board.score > best.score ? board : best),
            null
        )?.mask ?? null;

export const readGridGlyphs = (image: RgbaImageInterface): (Float32Array | null)[] | null => {
    const gray = toGrayscale(image, MAXIMUM_IMAGE_SIDE);
    const mask = findBestBoardMask(gray) ?? findBestBoardMask(invertGray(gray));

    return mask === null
        ? null
        : Array.from({ length: CELL_COUNT }, (_, cell) => extractCellGlyph(mask, Math.floor(cell / GRID_SIZE), cell % GRID_SIZE));
};
