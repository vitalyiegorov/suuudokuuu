import { readFileSync } from 'node:fs';

import jpeg from 'jpeg-js';
import { describe, expect, it } from 'vitest';

import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

import type { GridRecognitionType } from '../../src';

const FIXTURE_DIRECTORY = new URL('../fixtures/', import.meta.url);
const NO_GRID = 'none';
const CELL_COUNT = 81;
const MINIMUM_CELL_ACCURACY = 0.98;
const MINIMUM_EXACT_FIXTURE_RATIO = 0.8;

const fixtures = readFileSync(new URL('manifest.txt', FIXTURE_DIRECTORY), 'utf8')
    .trim()
    .split('\n')
    .map(line => {
        const [file, expected] = line.split(' ');

        return { file, expected };
    });
const gridFixtures = fixtures.filter(fixture => fixture.expected !== NO_GRID);
const noGridFixtures = fixtures.filter(fixture => fixture.expected === NO_GRID);

const recognizeFixture = (file: string): GridRecognitionType => {
    const decoded = jpeg.decode(readFileSync(new URL(file, FIXTURE_DIRECTORY)), { useTArray: true });

    return recognizeGrid({ width: decoded.width, height: decoded.height, data: new Uint8ClampedArray(decoded.data) });
};

const readPuzzleString = (recognition: GridRecognitionType): string =>
    recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.puzzleString : '';

const countMatchingCells = (actual: string, expected: string): number =>
    Array.from(expected).filter((cell, index) => actual[index] === cell).length;

describe('recognizeGrid', () => {
    const puzzleStrings = gridFixtures.map(fixture => readPuzzleString(recognizeFixture(fixture.file)));

    it('should recognize at least 98% of cells and 80% of fixtures exactly', () => {
        const matchingCellCount = gridFixtures.reduce(
            (total, fixture, index) => total + countMatchingCells(puzzleStrings[index], fixture.expected),
            0
        );
        const exactFixtureCount = gridFixtures.filter((fixture, index) => puzzleStrings[index] === fixture.expected).length;

        expect(gridFixtures.length).toBeGreaterThanOrEqual(30);
        expect(matchingCellCount / (gridFixtures.length * CELL_COUNT)).toBeGreaterThanOrEqual(MINIMUM_CELL_ACCURACY);
        expect(exactFixtureCount / gridFixtures.length).toBeGreaterThanOrEqual(MINIMUM_EXACT_FIXTURE_RATIO);
    });

    it('should report a missing grid for images without a sudoku', () => {
        expect(noGridFixtures.map(fixture => recognizeFixture(fixture.file).kind)).toEqual(
            noGridFixtures.map(() => GridRecognitionKindEnum.GRID_NOT_FOUND)
        );
    });

    it('should report a missing grid for an empty or truncated image buffer', () => {
        expect(recognizeGrid({ width: 0, height: 0, data: new Uint8ClampedArray() })).toStrictEqual({
            kind: GridRecognitionKindEnum.GRID_NOT_FOUND
        });
        expect(recognizeGrid({ width: 2, height: 2, data: new Uint8ClampedArray(3) })).toStrictEqual({
            kind: GridRecognitionKindEnum.GRID_NOT_FOUND
        });
    });

    it('should return a confidence and an alternative for every cell', () => {
        const recognition = recognizeFixture(gridFixtures[0].file);

        expect(recognition).toSatisfy(
            (result: GridRecognitionType) =>
                result.kind === GridRecognitionKindEnum.RECOGNIZED &&
                result.confidences.length === CELL_COUNT &&
                result.confidences.every(confidence => confidence >= 0 && confidence <= 1) &&
                result.alternatives.every((alternative, cell) => (alternative === null) === (result.puzzleString[cell] === '.'))
        );
    });
});
