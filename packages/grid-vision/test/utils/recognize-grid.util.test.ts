import { readFileSync } from 'node:fs';

import jpeg from 'jpeg-js';
import { describe, expect, it } from 'vitest';

import { renderFlatGrid } from '../../scripts/shared/render-synthetic-photo';
import { SeededRandom } from '../../scripts/shared/seeded-random';
import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

import type { GridRecognitionType } from '../../src';

const FIXTURE_DIRECTORY = new URL('../fixtures/', import.meta.url);
const NO_GRID = 'none';
const CELL_COUNT = 81;
const SPARSE_GRID_SEED = 2606;
const MINIMUM_HANDWRITTEN_ACCURACY = 0.95;
const MINIMUM_CELL_ACCURACY = 0.98;
const MINIMUM_EXACT_FIXTURE_RATIO = 0.8;

const fixtures = readFileSync(new URL('manifest.txt', FIXTURE_DIRECTORY), 'utf8')
    .trim()
    .split('\n')
    .map(line => {
        const [file, expected, handwritten = ''] = line.split(' ');

        return { file, expected, handwritten };
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
    const recognitions = gridFixtures.map(fixture => recognizeFixture(fixture.file));
    const puzzleStrings = recognitions.map(readPuzzleString);

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

    it('should identify at least 95% of filled-cell handwriting masks without false flags on other fixtures', () => {
        const cells = gridFixtures.flatMap((fixture, index) => {
            const recognition = recognitions[index];

            return recognition.kind === GridRecognitionKindEnum.RECOGNIZED
                ? Array.from(fixture.expected, (digit, cell) => ({
                      filled: digit !== '.',
                      handwritingFixture: fixture.handwritten.length > 0,
                      actual: recognition.handwritten[cell],
                      expected: fixture.handwritten[cell] === 'h'
                  }))
                : [];
        });
        const handwritingCells = cells.filter(cell => cell.handwritingFixture && cell.filled);

        expect(recognitions.map(recognition => recognition.kind)).toEqual(gridFixtures.map(() => GridRecognitionKindEnum.RECOGNIZED));
        expect(
            recognitions.map(recognition => (recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.handwritten.length : 0))
        ).toEqual(gridFixtures.map(() => CELL_COUNT));
        expect(
            gridFixtures.filter(fixture => fixture.handwritten.length > 0).map(fixture => /^[h.]{81}$/u.test(fixture.handwritten))
        ).toEqual(Array.from({ length: 6 }, () => true));
        expect(cells.filter(cell => !cell.handwritingFixture || !cell.filled).some(cell => cell.actual)).toBe(false);
        expect(handwritingCells.filter(cell => cell.actual === cell.expected).length / handwritingCells.length).toBeGreaterThanOrEqual(
            MINIMUM_HANDWRITTEN_ACCURACY
        );
    });

    it('should use the unique app puzzle with solution entries and exactly one wrong handwritten digit', () => {
        const printed = fixtures.find(fixture => fixture.file === 'app-classic-light-390.jpg')?.expected;
        const solution = '581279436342618957679354218214863579735491682896725341923147865457986123168532794';
        const wrongEntryCounts = gridFixtures
            .filter(fixture => fixture.handwritten.length > 0)
            .map(fixture => {
                expect(Array.from(fixture.expected, (digit, index) => (fixture.handwritten[index] === 'h' ? '.' : digit)).join('')).toBe(
                    printed
                );

                return Array.from(fixture.expected).filter(
                    (digit, index) => fixture.handwritten[index] === 'h' && digit !== solution[index]
                ).length;
            });
        expect(wrongEntryCounts).toEqual([0, 0, 0, 0, 0, 1]);
    });

    it.each([0, 1, 2])('should flag nothing with %i filled cells', filledCount => {
        const canvas = renderFlatGrid(
            new SeededRandom(SPARSE_GRID_SEED),
            '12'.slice(0, filledCount).padEnd(CELL_COUNT, '.'),
            'sans-serif',
            '.h'
        );
        const recognition = recognizeGrid(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));

        expect(recognition.kind).toBe(GridRecognitionKindEnum.RECOGNIZED);
        expect(recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.puzzleString.replaceAll('.', '').length : -1).toBe(
            filledCount
        );
        expect(recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.handwritten : []).toEqual(
            Array.from({ length: CELL_COUNT }, () => false)
        );
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
