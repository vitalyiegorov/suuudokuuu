import { CELL_COUNT, MAXIMUM_GRAY } from '../constants/grid-vision.constant';

import { readCellInk } from './read-cell-ink.util';

import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { WarpedBoardInterface } from '../interfaces/warped-board.interface';

const PENCIL_MARK_HEIGHT_RATIO = 0.6;
const DIGIT_HEIGHT_QUANTILE = 0.9;

export const readGridGlyphs = (image: RgbaImageInterface, board: WarpedBoardInterface) => {
    const cells = Array.from({ length: CELL_COUNT }, (_, cell) => readCellInk(image, board, cell));
    const filled = cells.filter(ink => ink !== null);
    const strokeHeights = filled.map(ink => ink.strokeHeight).sort((first, second) => first - second);
    const minimumStrokeHeight = PENCIL_MARK_HEIGHT_RATIO * (strokeHeights[Math.floor(DIGIT_HEIGHT_QUANTILE * strokeHeights.length)] ?? 0);
    const boardChroma = filled.map(ink => ink.backgroundChroma).sort((first, second) => first - second)[Math.floor(filled.length / 2)] ?? 0;

    return cells.map(ink =>
        ink === null || ink.strokeHeight < minimumStrokeHeight
            ? null
            : {
                  glyph: ink.glyph,
                  chroma: Math.max(0, ink.chroma - Math.max(0, ink.backgroundChroma - boardChroma)),
                  luma: board.isDarkInk ? ink.luma : MAXIMUM_GRAY - ink.luma
              }
    );
};
