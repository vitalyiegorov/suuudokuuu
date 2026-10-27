import { CELL_COUNT, CELL_SIZE, GRID_SIZE, WARPED_GRID_SIZE } from '../constants/grid-vision.constant';

import { adaptiveThreshold } from './adaptive-threshold.util';
import { extractCellGlyph } from './extract-cell-glyph.util';
import { labelComponents } from './label-components.util';
import { solveHomography } from './solve-homography.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';

const MAXIMUM_IMAGE_SIDE = 640;
const MAXIMUM_GRAY = 255;
const RGBA_CHANNEL_COUNT = 4;
const RED_LUMA_WEIGHT = 0.299;
const GREEN_LUMA_WEIGHT = 0.587;
const BLUE_LUMA_WEIGHT = 0.114;
const GRID_THRESHOLD_RADIUS_RATIO = 0.025;
const GRID_THRESHOLD_SENSITIVITY = 0.1;
const BRIDGE_RADIUS_RATIO = 0.008;
const MINIMUM_GRID_SIDE_RATIO = 0.25;
const MAXIMUM_CANDIDATE_COUNT = 3;
const PIXEL_CENTER = 0.5;
const INK_CONTRAST = 30;
const CELL_THRESHOLD_RADIUS = 12;
const CELL_THRESHOLD_SENSITIVITY = 0.15;
const LINE_BAND = 4;
const MINIMUM_LINE_CONTRAST = 0.25;
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

const dilateAlongAxis = (mask: BinaryImageInterface, radius: number, isHorizontal: boolean): BinaryImageInterface => {
    const data = new Uint8Array(mask.data.length);
    const lineCount = isHorizontal ? mask.height : mask.width;
    const length = isHorizontal ? mask.width : mask.height;
    const step = isHorizontal ? 1 : mask.width;

    for (let line = 0; line < lineCount; line += 1) {
        const start = isHorizontal ? line * mask.width : line;
        let count = 0;

        for (let position = -radius; position < length; position += 1) {
            count += position + radius < length ? mask.data[start + (position + radius) * step] : 0;
            count -= position - radius - 1 >= 0 ? mask.data[start + (position - radius - 1) * step] : 0;

            if (position >= 0) {
                data[start + position * step] = count > 0 ? 1 : 0;
            }
        }
    }

    return { ...mask, data };
};

const findCorners = (mask: BinaryImageInterface, labels: Int32Array, component: ConnectedComponentInterface): PointInterface[] => {
    const corners = [
        { x: 0, y: 0, score: Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: -Infinity },
        { x: 0, y: 0, score: Infinity }
    ];

    for (let y = component.minY; y <= component.maxY; y += 1) {
        for (let x = component.minX; x <= component.maxX; x += 1) {
            const index = y * mask.width + x;

            if (mask.data[index] === 1 && labels[index] === component.label) {
                corners[0] = x + y < corners[0].score ? { x, y, score: x + y } : corners[0];
                corners[1] = x - y > corners[1].score ? { x: x + 1, y, score: x - y } : corners[1];
                corners[2] = x + y > corners[2].score ? { x: x + 1, y: y + 1, score: x + y } : corners[2];
                corners[3] = x - y < corners[3].score ? { x, y: y + 1, score: x - y } : corners[3];
            }
        }
    }

    return corners;
};

const findGridCorners = (gray: GrayImageInterface): PointInterface[][] => {
    const longestSide = Math.max(gray.width, gray.height);
    const minimumSide = MINIMUM_GRID_SIDE_RATIO * Math.min(gray.width, gray.height);
    const mask = adaptiveThreshold(gray, Math.round(longestSide * GRID_THRESHOLD_RADIUS_RATIO), GRID_THRESHOLD_SENSITIVITY);
    const bridgeRadius = Math.max(1, Math.round(longestSide * BRIDGE_RADIUS_RATIO));

    return [mask, dilateAlongAxis(dilateAlongAxis(mask, bridgeRadius, true), bridgeRadius, false)]
        .map(labelComponents)
        .flatMap(({ labels, components }) =>
            components
                .filter(component => component.maxX - component.minX >= minimumSide && component.maxY - component.minY >= minimumSide)
                .map(component => ({ labels, component, area: (component.maxX - component.minX) * (component.maxY - component.minY) }))
        )
        .sort((first, second) => second.area - first.area)
        .slice(0, MAXIMUM_CANDIDATE_COUNT)
        .map(({ labels, component }) => findCorners(mask, labels, component));
};

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

const warpBoard = (gray: GrayImageInterface, homography: Float64Array): GrayImageInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const data = new Float32Array(WARPED_GRID_SIZE * WARPED_GRID_SIZE);

    for (let index = 0; index < data.length; index += 1) {
        const targetX = (index % WARPED_GRID_SIZE) + PIXEL_CENTER;
        const targetY = Math.floor(index / WARPED_GRID_SIZE) + PIXEL_CENTER;
        const depth = h20 * targetX + h21 * targetY + h22;

        data[index] = sampleBilinear(
            gray,
            (h00 * targetX + h01 * targetY + h02) / depth - PIXEL_CENTER,
            (h10 * targetX + h11 * targetY + h12) / depth - PIXEL_CENTER
        );
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

const findBestBoardMask = (gray: GrayImageInterface): BinaryImageInterface | null =>
    findGridCorners(gray)
        .map(corners => solveHomography(WARPED_TARGET_CORNERS, corners))
        .filter(homography => homography !== null)
        .map(homography => warpBoard(gray, homography))
        .map(board => adaptiveThreshold(hasDarkInk(board) ? board : invertGray(board), CELL_THRESHOLD_RADIUS, CELL_THRESHOLD_SENSITIVITY))
        .map(mask => ({ mask, score: scoreBoard(mask) }))
        .filter(board => board.score > -Infinity)
        .reduce<{ mask: BinaryImageInterface; score: number } | null>(
            (best, board) => (best === null || board.score > best.score ? board : best),
            null
        )?.mask ?? null;

export const readGridGlyphs = (image: RgbaImageInterface): (Float32Array | null)[] | null => {
    if (image.width <= 0 || image.height <= 0 || image.data.length < image.width * image.height * RGBA_CHANNEL_COUNT) {
        return null;
    }

    const gray = toGrayscale(image);
    const mask = findBestBoardMask(gray) ?? findBestBoardMask(invertGray(gray));

    return mask === null
        ? null
        : Array.from({ length: CELL_COUNT }, (_, cell) => extractCellGlyph(mask, Math.floor(cell / GRID_SIZE), cell % GRID_SIZE));
};
