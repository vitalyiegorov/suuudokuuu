import { readFileSync } from 'node:fs';

import { createCanvas } from '@napi-rs/canvas';
import jpeg from 'jpeg-js';
import { describe, expect, it } from 'vitest';

import { WHOLE_IMAGE_REGION, readCanvasRegion } from '../../scripts/shared/read-canvas-region';
import { FIXTURE_DIRECTORY, readFixtureManifest } from '../../scripts/shared/write-fixture';
import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

const CELL_COUNT = 81;
const MINIMUM_PHOTO_CELL_ACCURACY = 0.995;
const MINIMUM_EXACT_PHOTO_RATIO = 0.85;
const DISTORTIONS = [
    { scale: 1, shiftX: 3, shiftY: 0, quality: 90 },
    { scale: 0.9, shiftX: 2, shiftY: 3, quality: 85 },
    { scale: 0.8, shiftX: 0, shiftY: 5, quality: 92 }
];

const readings = [...readFixtureManifest()]
    .map(([file, expected]) => ({ file, puzzle: expected.split(' ')[0] }))
    .filter(({ puzzle }) => puzzle.length === CELL_COUNT)
    .flatMap(({ file, puzzle }) => {
        const decoded = jpeg.decode(readFileSync(new URL(file, FIXTURE_DIRECTORY)), { useTArray: true, formatAsRGBA: true });
        const fixture = createCanvas(decoded.width, decoded.height);
        const pixels = fixture.getContext('2d').createImageData(decoded.width, decoded.height);

        pixels.data.set(decoded.data);
        fixture.getContext('2d').putImageData(pixels, 0, 0);

        return DISTORTIONS.map(({ scale, shiftX, shiftY, quality }) => {
            const distorted = createCanvas(Math.round((fixture.width - shiftX) * scale), Math.round((fixture.height - shiftY) * scale));

            distorted
                .getContext('2d')
                .drawImage(
                    fixture,
                    shiftX,
                    shiftY,
                    fixture.width - shiftX,
                    fixture.height - shiftY,
                    0,
                    0,
                    distorted.width,
                    distorted.height
                );

            const recognition = recognizeGrid(readCanvasRegion(distorted, WHOLE_IMAGE_REGION, true, quality));

            return { file, puzzle, puzzleString: recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.puzzleString : '' };
        });
    });

describe('recognizeGrid on shifted, rescaled and recompressed fixtures', () => {
    it('should still read every app screenshot exactly', () => {
        expect(
            readings.filter(({ file, puzzle, puzzleString }) => file.startsWith('app-') && puzzleString !== puzzle).map(({ file }) => file)
        ).toEqual([]);
    });

    it('should keep its cell accuracy and exact reads on photographed fixtures', () => {
        const photos = readings.filter(({ file }) => !file.startsWith('app-'));
        const matchingCellCount = photos.reduce(
            (total, { puzzle, puzzleString }) => total + Array.from(puzzle).filter((cell, index) => puzzleString[index] === cell).length,
            0
        );

        expect(matchingCellCount / (photos.length * CELL_COUNT)).toBeGreaterThanOrEqual(MINIMUM_PHOTO_CELL_ACCURACY);
        expect(photos.filter(({ puzzle, puzzleString }) => puzzleString === puzzle).length / photos.length).toBeGreaterThanOrEqual(
            MINIMUM_EXACT_PHOTO_RATIO
        );
    });
});
