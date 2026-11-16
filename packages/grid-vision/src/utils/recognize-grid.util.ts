import { HANDWRITTEN_CHROMA_DIFFERENCE, HANDWRITTEN_LUMA_DIFFERENCE } from '../constants/grid-vision.constant';
import { GridRecognitionKindEnum } from '../enums/grid-recognition-kind.enum';

import { classifyGlyph } from './classify-glyph.util';
import { findCloserRegion } from './find-closer-region.util';
import { readGridGlyphs } from './read-grid-glyphs.util';

import type { RgbaImageInterface } from '../interfaces/rgba-image.interface';
import type { GridRecognitionType } from '../types/grid-recognition.type';

const EMPTY_CELL = '.';
const ENTRY_SEPARATION = 4;

const findEntryThreshold = (values: readonly number[], minimumDifference: number): number => {
    const sorted = [...values].sort((first, second) => first - second);
    const total = sorted.reduce((sum, value) => sum + value, 0);
    const totalSquares = sorted.reduce((sum, value) => sum + value ** 2, 0);
    let lowSum = 0;
    let lowSquares = 0;
    let best = { spread: 0, difference: 0, deviation: 0, threshold: Infinity };

    for (let lowCount = 1; lowCount < sorted.length; lowCount += 1) {
        lowSum += sorted[lowCount - 1];
        lowSquares += sorted[lowCount - 1] ** 2;

        const highCount = sorted.length - lowCount;
        const difference = (total - lowSum) / highCount - lowSum / lowCount;
        const spread = lowCount * highCount * difference ** 2;

        if (spread > best.spread) {
            best = {
                spread,
                difference,
                deviation: Math.sqrt(
                    Math.max(0, lowSquares - lowSum ** 2 / lowCount + totalSquares - lowSquares - (total - lowSum) ** 2 / highCount) /
                        sorted.length
                ),
                threshold: (sorted[lowCount] + sorted[lowCount - 1]) / 2
            };
        }
    }

    return best.difference >= Math.max(minimumDifference, ENTRY_SEPARATION * best.deviation) ? best.threshold : Infinity;
};

export const recognizeGrid = (image: RgbaImageInterface, sourceScale = 1): GridRecognitionType => {
    const board = readGridGlyphs(image);

    if (board === null) {
        return { kind: GridRecognitionKindEnum.GRID_NOT_FOUND };
    }

    const probabilities = board.cells.map(ink => (ink === null ? null : Array.from(classifyGlyph(ink.glyph))));
    const confidences = probabilities.map(digits => (digits === null ? 1 : Math.max(...digits)));
    const filled = board.cells.filter(ink => ink !== null);
    const lumaThreshold = findEntryThreshold(
        filled.map(ink => ink.luma),
        HANDWRITTEN_LUMA_DIFFERENCE
    );
    const chromaThreshold = findEntryThreshold(
        filled.map(ink => ink.chroma),
        HANDWRITTEN_CHROMA_DIFFERENCE
    );

    return {
        kind: GridRecognitionKindEnum.RECOGNIZED,
        handwritten: board.cells.map(
            ink => filled.length >= 3 && ink !== null && (ink.luma > lumaThreshold || ink.chroma > chromaThreshold)
        ),
        puzzleString: probabilities
            .map((digits, cell) => (digits === null ? EMPTY_CELL : (digits.indexOf(confidences[cell]) + 1).toString()))
            .join(''),
        confidences,
        probabilities,
        closerRegion: findCloserRegion(board.corners, image, sourceScale)
    };
};
