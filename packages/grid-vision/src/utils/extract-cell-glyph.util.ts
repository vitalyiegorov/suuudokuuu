import { CELL_SIZE, GLYPH_PIXEL_COUNT, GLYPH_SIZE } from '../constants/grid-vision.constant';

import { labelComponents } from './label-components.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';

const CELL_MARGIN = 2;
const CROP_SIZE = CELL_SIZE - 2 * CELL_MARGIN;
const LINE_ZONE = 10;
const LINE_INK_RATIO = 0.5;
const CENTRAL_RADIUS_RATIO = 0.3;
const MINIMUM_PIECE_AREA = 4;
const MINIMUM_INK_AREA = 30;
const MINIMUM_GLYPH_HEIGHT_RATIO = 0.3;
const GLYPH_BOX_SIZE = 20;
const SUPERSAMPLE_COUNT = 3;
const PIXEL_CENTER = 0.5;
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

const sampleGlyphPixel = (
    isGlyphLabel: Uint8Array,
    labels: Int32Array,
    bounds: ConnectedComponentInterface,
    glyphIndex: number
): number => {
    const scale = GLYPH_BOX_SIZE / (Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) + 1);
    const originX = (bounds.minX + bounds.maxX + 1) / 2 + ((glyphIndex % GLYPH_SIZE) - GLYPH_SIZE / 2) / scale;
    const originY = (bounds.minY + bounds.maxY + 1) / 2 + (Math.floor(glyphIndex / GLYPH_SIZE) - GLYPH_SIZE / 2) / scale;
    let inkCount = 0;

    for (let sample = 0; sample < SUPERSAMPLE_COUNT * SUPERSAMPLE_COUNT; sample += 1) {
        const sourceX = Math.floor(originX + ((sample % SUPERSAMPLE_COUNT) + PIXEL_CENTER) / SUPERSAMPLE_COUNT / scale);
        const sourceY = Math.floor(originY + (Math.floor(sample / SUPERSAMPLE_COUNT) + PIXEL_CENTER) / SUPERSAMPLE_COUNT / scale);
        const isInside = sourceX >= 0 && sourceY >= 0 && sourceX < CROP_SIZE && sourceY < CROP_SIZE;

        inkCount += isInside ? isGlyphLabel[labels[sourceY * CROP_SIZE + sourceX]] : 0;
    }

    return inkCount / (SUPERSAMPLE_COUNT * SUPERSAMPLE_COUNT);
};

export const extractCellGlyph = (mask: BinaryImageInterface, row: number, column: number): Float32Array | null => {
    const { labels, components } = labelComponents(eraseGridLines(cropCell(mask, row, column)));
    const pieces = components.filter(isCentralPiece);
    const bounds = pieces.length > 0 ? mergePieces(pieces) : null;

    if (bounds === null || bounds.area < MINIMUM_INK_AREA || bounds.maxY - bounds.minY + 1 < MINIMUM_GLYPH_HEIGHT_RATIO * CELL_SIZE) {
        return null;
    }

    const isGlyphLabel = new Uint8Array(components.length + 1);

    for (const piece of pieces) {
        isGlyphLabel[piece.label] = 1;
    }

    return Float32Array.from({ length: GLYPH_PIXEL_COUNT }, (_, glyphIndex) => sampleGlyphPixel(isGlyphLabel, labels, bounds, glyphIndex));
};
