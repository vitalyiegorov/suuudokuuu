import {
    BLUE_LUMA_WEIGHT,
    CELL_SIZE,
    GREEN_LUMA_WEIGHT,
    GRID_SIZE,
    LINE_BAND,
    MAXIMUM_GRAY,
    PIXEL_CENTER,
    RED_LUMA_WEIGHT,
    RGBA_CHANNEL_COUNT,
    WARPED_GRID_SIZE
} from '../constants/grid-vision.constant';

import { adaptiveThreshold } from './adaptive-threshold.util';
import { findCloserRegion } from './find-closer-region.util';
import { findGridCorners } from './find-grid-corners.util';
import { findGridLattice } from './find-grid-lattice.util';
import { fitGridCorners } from './fit-grid-corners.util';
import { hasDarkInk } from './has-dark-ink.util';
import { keepThinInk } from './keep-thin-ink.util';
import { projectPoint } from './project-point.util';
import { refineGridCorners } from './refine-grid-corners.util';
import { solveHomography } from './solve-homography.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { PointInterface } from '../interfaces/point.interface';
import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { WarpedBoardInterface } from '../interfaces/warped-board.interface';

const MAXIMUM_IMAGE_SIDE = 640;
const CELL_THRESHOLD_RADIUS = 12;
const CELL_THRESHOLD_SENSITIVITY = 0.15;
const MINIMUM_LINE_CONTRAST = 0.25;
const MINIMUM_FUSED_SCORE = 8;
const SQUARE_SIDE_TOLERANCE = 0.08;
const VISIBLE_INSET = 1;
const INNER_BOX_LINE_POSITIONS = [WARPED_GRID_SIZE / 3, (2 * WARPED_GRID_SIZE) / 3];
const WARPED_TARGET_CORNERS: readonly PointInterface[] = [
    { x: 0, y: 0 },
    { x: WARPED_GRID_SIZE, y: 0 },
    { x: WARPED_GRID_SIZE, y: WARPED_GRID_SIZE },
    { x: 0, y: WARPED_GRID_SIZE }
];

const toLuma = (image: RgbaImageInterface): GrayImageInterface => {
    const data = new Float32Array(image.width * image.height);

    for (let index = 0; index < data.length; index += 1) {
        const offset = index * RGBA_CHANNEL_COUNT;

        data[index] =
            RED_LUMA_WEIGHT * image.data[offset] + GREEN_LUMA_WEIGHT * image.data[offset + 1] + BLUE_LUMA_WEIGHT * image.data[offset + 2];
    }

    return { width: image.width, height: image.height, data };
};

const measureDownscale = (image: GrayImageInterface): number => Math.max(1, Math.max(image.width, image.height) / MAXIMUM_IMAGE_SIDE);

const downscaleLuma = (luma: GrayImageInterface, scale: number): GrayImageInterface => {
    const width = Math.floor(luma.width / scale);
    const height = Math.floor(luma.height / scale);
    const data = new Float32Array(width * height);

    for (let index = 0; index < data.length; index += 1) {
        const startX = Math.floor((index % width) * scale);
        const endX = Math.max(startX + 1, Math.floor(((index % width) + 1) * scale));
        const startY = Math.floor(Math.floor(index / width) * scale);
        const endY = Math.max(startY + 1, Math.floor((Math.floor(index / width) + 1) * scale));
        let sum = 0;

        for (let sourceY = startY; sourceY < endY; sourceY += 1) {
            for (let sourceX = startX; sourceX < endX; sourceX += 1) {
                sum += luma.data[sourceY * luma.width + sourceX];
            }
        }

        data[index] = sum / ((endX - startX) * (endY - startY));
    }

    return { width, height, data };
};

const invertGray = (image: GrayImageInterface): GrayImageInterface => ({ ...image, data: image.data.map(value => MAXIMUM_GRAY - value) });

const projectWarpedPixel = (homography: Float64Array, index: number): PointInterface =>
    projectPoint(homography, (index % WARPED_GRID_SIZE) + PIXEL_CENTER, Math.floor(index / WARPED_GRID_SIZE) + PIXEL_CENTER);

const warpBoard = ({ width, height, data: source }: GrayImageInterface, homography: Float64Array): GrayImageInterface => {
    const [h00, h01, h02, h10, h11, h12, h20, h21, h22] = homography;
    const data = new Float32Array(WARPED_GRID_SIZE * WARPED_GRID_SIZE);

    for (let index = 0; index < data.length; index += 1) {
        const x = (index % WARPED_GRID_SIZE) + PIXEL_CENTER;
        const y = Math.floor(index / WARPED_GRID_SIZE) + PIXEL_CENTER;
        const depth = h20 * x + h21 * y + h22;
        const sourceX = Math.min(Math.max((h00 * x + h01 * y + h02) / depth - PIXEL_CENTER, 0), width - 1);
        const sourceY = Math.min(Math.max((h10 * x + h11 * y + h12) / depth - PIXEL_CENTER, 0), height - 1);
        const left = Math.floor(sourceX);
        const top = Math.floor(sourceY);
        const right = Math.min(left + 1, width - 1);
        const bottomRow = Math.min(top + 1, height - 1) * width;
        const horizontalWeight = sourceX - left;

        data[index] =
            (source[top * width + left] * (1 - horizontalWeight) + source[top * width + right] * horizontalWeight) * (1 - (sourceY - top)) +
            (source[bottomRow + left] * (1 - horizontalWeight) + source[bottomRow + right] * horizontalWeight) * (sourceY - top);
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

const readBoard = (luma: GrayImageInterface, corners: readonly PointInterface[], knownIsDarkInk: boolean | null = null) => {
    const homography = solveHomography(WARPED_TARGET_CORNERS, corners);

    if (homography === null) {
        return null;
    }

    const board = warpBoard(luma, homography);
    const isDarkInk = knownIsDarkInk ?? hasDarkInk(board);
    const gray = isDarkInk ? board : invertGray(board);

    return { corners, homography, isDarkInk, gray, mask: adaptiveThreshold(gray, CELL_THRESHOLD_RADIUS, CELL_THRESHOLD_SENSITIVITY) };
};

const refitBoard = <Board extends WarpedBoardInterface>(
    luma: GrayImageInterface,
    board: Board | null,
    fitCorners: (mask: BinaryImageInterface) => PointInterface[] | null
) => {
    const corners = board === null ? null : fitCorners(keepThinInk(board.mask, LINE_BAND));

    return board === null || corners === null
        ? board
        : (readBoard(
              luma,
              corners.map(corner => projectPoint(board.homography, corner.x, corner.y)),
              board.isDarkInk
          ) ?? board);
};

const readFusedBoard = (luma: GrayImageInterface, corners: readonly PointInterface[]) => {
    const board = refitBoard(luma, refitBoard(luma, readBoard(luma, corners), fitGridCorners), fitGridCorners);
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

const readLatticeBoard = (luma: GrayImageInterface, gray: GrayImageInterface) => {
    const lattice = findGridLattice(gray);
    const scale = measureDownscale(luma);
    const board =
        lattice === null
            ? null
            : refitBoard(
                  luma,
                  readBoard(
                      luma,
                      lattice.corners.map(corner => ({ x: corner.x * scale, y: corner.y * scale }))
                  ),
                  refineGridCorners
              );
    const isHidden = (index: number): boolean => {
        const row = Math.floor(index / WARPED_GRID_SIZE / CELL_SIZE);
        const column = Math.floor((index % WARPED_GRID_SIZE) / CELL_SIZE);

        return [row, column].some(
            (cell, axis) =>
                (cell === 0 || cell === GRID_SIZE - 1) &&
                lattice?.[axis === 0 ? 'visibleRows' : 'visibleColumns'][cell === 0 ? 0 : 1] === false
        );
    };

    return board === null || lattice === null
        ? null
        : {
              ...board,
              isConfident: lattice.isConfident,
              gray: { ...board.gray, data: board.gray.data.map((value, index) => (isHidden(index) ? MAXIMUM_GRAY : value)) },
              mask: { ...board.mask, data: board.mask.data.map((value, index) => (isHidden(index) ? 0 : value)) }
          };
};

const findBestBoardMask = (luma: GrayImageInterface, gray: GrayImageInterface, isInvertedSearch: boolean, isFusedSearch: boolean) =>
    findGridCorners(isInvertedSearch ? invertGray(gray) : gray, isFusedSearch)
        .filter(
            (corners, index, candidates) =>
                candidates.findIndex(other =>
                    other.every((corner, order) => corner.x === corners[order].x && corner.y === corners[order].y)
                ) === index
        )
        .map(corners => corners.map(corner => ({ x: corner.x * measureDownscale(luma), y: corner.y * measureDownscale(luma) })))
        .map(corners => (isFusedSearch ? readFusedBoard(luma, corners) : readBoard(luma, corners)))
        .filter(board => board !== null)
        .map(board => ({ ...board, score: scoreBoard(board.mask) }))
        .filter(board => board.score > -Infinity)
        .reduce<(WarpedBoardInterface & { readonly score: number }) | null>(
            (best, board) => (best === null || board.score > best.score ? board : best),
            null
        );

const isSquareBoard = (corners: readonly PointInterface[]): boolean => {
    const sides = corners.map((corner, index) => {
        const next = corners[(index + 1) % corners.length];

        return Math.hypot(next.x - corner.x, next.y - corner.y);
    });

    return Math.max(...sides) <= Math.min(...sides) * (1 + SQUARE_SIDE_TOLERANCE);
};

const isSameBoard = (corners: readonly PointInterface[], others: readonly PointInterface[]): boolean => {
    const cellSide = Math.hypot(corners[1].x - corners[0].x, corners[1].y - corners[0].y) / GRID_SIZE;

    return corners.every((corner, index) => Math.hypot(corner.x - others[index].x, corner.y - others[index].y) <= cellSide / 2);
};

export const findGridBoard = (image: RgbaImageInterface, sourceScale: number) => {
    if (image.width <= 0 || image.height <= 0 || image.data.length < image.width * image.height * RGBA_CHANNEL_COUNT) {
        return null;
    }

    const luma = toLuma(image);
    const gray = downscaleLuma(luma, measureDownscale(luma));
    const plainBoard = findBestBoardMask(luma, gray, false, false) ?? findBestBoardMask(luma, gray, true, false);
    const latticeBoard = plainBoard === null ? readLatticeBoard(luma, gray) : null;
    const fusedBoard =
        plainBoard === null && (latticeBoard === null || !latticeBoard.isConfident)
            ? (findBestBoardMask(luma, gray, false, true) ?? findBestBoardMask(luma, gray, true, true))
            : null;
    const isFusedTrusted =
        fusedBoard !== null &&
        (fusedBoard.score >= MINIMUM_FUSED_SCORE || isSquareBoard(fusedBoard.corners)) &&
        (latticeBoard === null || !isSameBoard(fusedBoard.corners, latticeBoard.corners));
    const board = plainBoard ?? (isFusedTrusted ? fusedBoard : null) ?? latticeBoard ?? fusedBoard;
    const closerRegion = board === null ? null : findCloserRegion(board.corners, image, sourceScale);

    if (board === null || closerRegion !== null) {
        return closerRegion === null ? null : { closerRegion, board: null };
    }

    return { closerRegion, board: refitBoard(luma, plainBoard, refineGridCorners) ?? board };
};
