import { GridRecognitionKindEnum } from '../enums/grid-recognition-kind.enum';

import { classifyGlyph } from './classify-glyph.util';
import { readGridGlyphs } from './read-grid-glyphs.util';

import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { GridRecognitionType } from '../types/grid-recognition.type';

const EMPTY_CELL = '.';

export const recognizeGrid = (image: RgbaImageInterface): GridRecognitionType => {
    const glyphs = readGridGlyphs(image);

    if (glyphs === null) {
        return { kind: GridRecognitionKindEnum.GRID_NOT_FOUND };
    }

    const predictions = glyphs.map(glyph => (glyph === null ? null : classifyGlyph(glyph)));

    return {
        kind: GridRecognitionKindEnum.RECOGNIZED,
        puzzleString: predictions.map(prediction => prediction?.digit.toString() ?? EMPTY_CELL).join(''),
        confidences: predictions.map(prediction => prediction?.confidence ?? 1),
        alternatives: predictions.map(prediction => prediction?.alternative ?? null)
    };
};
