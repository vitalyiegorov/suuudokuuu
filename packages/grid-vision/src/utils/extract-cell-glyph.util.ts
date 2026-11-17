import { CELL_SIZE, GLYPH_PIXEL_COUNT, GLYPH_SIZE, PIXEL_CENTER } from '../constants/grid-vision.constant';

import { dilateMask } from './dilate-mask.util';
import { labelComponents } from './label-components.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';
import type { GrayImageInterface } from '../interfaces/gray-image.interface';
import type { WarpedBoardInterface } from '../interfaces/warped-board.interface';

const CELL_MARGIN = 2;
const CROP_SIZE = CELL_SIZE - 2 * CELL_MARGIN;
const LINE_ZONE = 10;
const LINE_INK_RATIO = 0.5;
const CENTRAL_RADIUS_RATIO = 0.3;
const MINIMUM_PIECE_AREA = 4;
const MINIMUM_INK_AREA = 30;
const MINIMUM_GLYPH_HEIGHT_RATIO = 0.3;
const STROKE_GAP = 3;
const GLYPH_BOX_SIZE = 20;
const SUPERSAMPLE_COUNT = 3;
const INK_LEVEL_QUANTILE = 0.1;
const GLYPH_REACH = 2;
const EDGE_OFFSETS = Array.from({ length: CROP_SIZE }, (_, offset) => offset).filter(
    offset => offset < LINE_ZONE || offset >= CROP_SIZE - LINE_ZONE
);

const cropCell = (mask: BinaryImageInterface, row: number, column: number): BinaryImageInterface => {
    const data = new Uint8Array(CROP_SIZE * CROP_SIZE);
    const originX = column * CELL_SIZE + CELL_MARGIN;
    const originY = row * CELL_SIZE + CELL_MARGIN;

    for (let y = 0; y < CROP_SIZE; y += 1) {
        const sourceStart = (originY + y) * mask.width + originX;

        data.set(mask.data.subarray(sourceStart, sourceStart + CROP_SIZE), y * CROP_SIZE);
    }

    return { width: CROP_SIZE, height: CROP_SIZE, data };
};

const eraseGridLines = (crop: BinaryImageInterface): BinaryImageInterface => {
    const data = crop.data.slice();

    for (const offset of EDGE_OFFSETS) {
        let rowInk = 0;
        let columnInk = 0;

        for (let along = 0; along < CROP_SIZE; along += 1) {
            rowInk += crop.data[offset * CROP_SIZE + along];
            columnInk += crop.data[along * CROP_SIZE + offset];
        }

        for (let along = 0; along < CROP_SIZE; along += 1) {
            data[offset * CROP_SIZE + along] = rowInk >= LINE_INK_RATIO * CROP_SIZE ? 0 : data[offset * CROP_SIZE + along];
            data[along * CROP_SIZE + offset] = columnInk >= LINE_INK_RATIO * CROP_SIZE ? 0 : data[along * CROP_SIZE + offset];
        }
    }

    return { ...crop, data };
};

const isCentralPiece = (component: ConnectedComponentInterface): boolean =>
    component.area >= MINIMUM_PIECE_AREA &&
    Math.abs((component.minX + component.maxX) / 2 - CROP_SIZE / 2) <= CENTRAL_RADIUS_RATIO * CROP_SIZE &&
    Math.abs((component.minY + component.maxY) / 2 - CROP_SIZE / 2) <= CENTRAL_RADIUS_RATIO * CROP_SIZE;

const mergePieces = (pieces: readonly ConnectedComponentInterface[]): ConnectedComponentInterface => ({
    label: 0,
    area: pieces.reduce((total, piece) => total + piece.area, 0),
    minX: Math.min(...pieces.map(piece => piece.minX)),
    maxX: Math.max(...pieces.map(piece => piece.maxX)),
    minY: Math.min(...pieces.map(piece => piece.minY)),
    maxY: Math.max(...pieces.map(piece => piece.maxY))
});

const measureStrokeHeight = (pieces: readonly ConnectedComponentInterface[]): number => {
    const ordered = [...pieces].sort((first, second) => first.minY - second.minY);
    const strokes = ordered.map((seed, index) =>
        ordered
            .slice(index + 1)
            .reduce(
                (stroke, piece) =>
                    piece.minY - stroke.maxY <= STROKE_GAP &&
                    piece.minX - stroke.maxX <= STROKE_GAP &&
                    stroke.minX - piece.maxX <= STROKE_GAP
                        ? mergePieces([stroke, piece])
                        : stroke,
                seed
            )
    );

    return Math.max(...strokes.map(stroke => stroke.maxY - stroke.minY + 1));
};

const measureDarkness = (gray: GrayImageInterface, cropOffset: number, labels: Int32Array, isGlyphLabel: Uint8Array): Float32Array => {
    const levels = new Float32Array(labels.length);
    const glyphMask = new Uint8Array(labels.length);
    let glyphArea = 0;

    for (let pixel = 0; pixel < labels.length; pixel += 1) {
        levels[pixel] = gray.data[cropOffset + Math.floor(pixel / CROP_SIZE) * gray.width + (pixel % CROP_SIZE)];
        glyphMask[pixel] = isGlyphLabel[labels[pixel]];
        glyphArea += glyphMask[pixel];
    }

    const inkLevels = new Float32Array(glyphArea);
    let inkCount = 0;

    for (let pixel = 0; pixel < labels.length; pixel += 1) {
        if (glyphMask[pixel] === 1) {
            inkLevels[inkCount] = levels[pixel];
            inkCount += 1;
        }
    }

    const paper = levels.slice().sort()[Math.floor(levels.length / 2)];
    const contrast = Math.max(1, paper - inkLevels.sort()[Math.floor(INK_LEVEL_QUANTILE * inkLevels.length)]);
    const reach = dilateMask({ width: CROP_SIZE, height: CROP_SIZE, data: glyphMask }, GLYPH_REACH).data;

    for (let pixel = 0; pixel < levels.length; pixel += 1) {
        levels[pixel] = reach[pixel] === 1 ? Math.min(1, Math.max(0, (paper - levels[pixel]) / contrast)) : 0;
    }

    return levels;
};

const sampleGlyphPixel = (darkness: Float32Array, bounds: ConnectedComponentInterface, glyphIndex: number): number => {
    const scale = GLYPH_BOX_SIZE / (Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) + 1);
    const originX = (bounds.minX + bounds.maxX + 1) / 2 + ((glyphIndex % GLYPH_SIZE) - GLYPH_SIZE / 2) / scale;
    const originY = (bounds.minY + bounds.maxY + 1) / 2 + (Math.floor(glyphIndex / GLYPH_SIZE) - GLYPH_SIZE / 2) / scale;
    let inkSum = 0;

    for (let sample = 0; sample < SUPERSAMPLE_COUNT * SUPERSAMPLE_COUNT; sample += 1) {
        const sourceX = Math.floor(originX + ((sample % SUPERSAMPLE_COUNT) + PIXEL_CENTER) / SUPERSAMPLE_COUNT / scale);
        const sourceY = Math.floor(originY + (Math.floor(sample / SUPERSAMPLE_COUNT) + PIXEL_CENTER) / SUPERSAMPLE_COUNT / scale);
        const isInside = sourceX >= 0 && sourceY >= 0 && sourceX < CROP_SIZE && sourceY < CROP_SIZE;

        inkSum += isInside ? darkness[sourceY * CROP_SIZE + sourceX] : 0;
    }

    return inkSum / (SUPERSAMPLE_COUNT * SUPERSAMPLE_COUNT);
};

export const extractCellGlyph = (
    board: Pick<WarpedBoardInterface, 'gray' | 'mask'>,
    row: number,
    column: number,
    visitInk: ((x: number, y: number) => void) | null = null
) => {
    const { labels, components } = labelComponents(eraseGridLines(cropCell(board.mask, row, column)));
    const pieces = components.filter(isCentralPiece);
    const bounds = pieces.length > 0 ? mergePieces(pieces) : null;

    if (bounds === null || bounds.area < MINIMUM_INK_AREA || bounds.maxY - bounds.minY + 1 < MINIMUM_GLYPH_HEIGHT_RATIO * CELL_SIZE) {
        return null;
    }

    const isGlyphLabel = new Uint8Array(components.length + 1);

    for (const piece of pieces) {
        isGlyphLabel[piece.label] = 1;
    }

    if (visitInk !== null) {
        for (let pixel = 0; pixel < labels.length; pixel += 1) {
            if (isGlyphLabel[labels[pixel]] === 1) {
                visitInk(
                    column * CELL_SIZE + CELL_MARGIN + (pixel % CROP_SIZE),
                    row * CELL_SIZE + CELL_MARGIN + Math.floor(pixel / CROP_SIZE)
                );
            }
        }
    }

    const darkness = measureDarkness(
        board.gray,
        (row * CELL_SIZE + CELL_MARGIN) * board.gray.width + column * CELL_SIZE + CELL_MARGIN,
        labels,
        isGlyphLabel
    );

    return {
        glyph: Float32Array.from({ length: GLYPH_PIXEL_COUNT }, (_, glyphIndex) => sampleGlyphPixel(darkness, bounds, glyphIndex)),
        strokeHeight: measureStrokeHeight(pieces)
    };
};
