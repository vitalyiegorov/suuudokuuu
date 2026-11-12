import { readFileSync } from 'node:fs';

import { createCanvas } from '@napi-rs/canvas';
import jpeg from 'jpeg-js';
import { describe, expect, it } from 'vitest';

import { renderFlatGrid } from '../../scripts/shared/render-synthetic-photo';
import { SeededRandom } from '../../scripts/shared/seeded-random';
import { GridRecognitionKindEnum, recognizeGrid } from '../../src';

import type { GridRecognitionType } from '../../src';
import type { Canvas } from '@napi-rs/canvas';

const FIXTURE_DIRECTORY = new URL('../fixtures/', import.meta.url);
const NO_GRID = 'none';
const CELL_COUNT = 81;
const SPARSE_GRID_SEED = 2606;
const MINIMUM_HANDWRITTEN_ACCURACY = 0.95;
const MINIMUM_CELL_ACCURACY = 0.98;
const MINIMUM_EXACT_FIXTURE_RATIO = 0.8;
const GRID_SIZE = 9;
const FLAT_GRID_SEED = 32;
const PAGE_MARGIN = 60;
const HIDDEN_CELL_RATIO = 0.4;
const PENCIL_MARK_CELL_RATIO = 0.22;

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

const renderPrintedGrid = (puzzle: string) => {
    const canvas = renderFlatGrid(new SeededRandom(FLAT_GRID_SEED), puzzle, 'sans-serif');
    const context = canvas.getContext('2d');
    const middleRow = context.getImageData(0, canvas.height / 2, canvas.width, 1).data;
    const margin = middleRow.findIndex((value, index) => index % 4 === 0 && Math.abs(value - middleRow[0]) > 40) / 4;

    return { canvas, context, margin, cellSize: (canvas.width - 2 * margin) / GRID_SIZE };
};

const recognizeOnDarkPage = (canvas: Canvas, hiddenX: number, hiddenY: number) => {
    const width = canvas.width - Math.abs(hiddenX);
    const height = canvas.height - Math.abs(hiddenY);
    const page = createCanvas(width + 2 * PAGE_MARGIN, height + 2 * PAGE_MARGIN);
    const context = page.getContext('2d');

    context.fillStyle = '#0e1113';
    context.fillRect(0, 0, page.width, page.height);
    context.drawImage(canvas, Math.max(0, hiddenX), Math.max(0, hiddenY), width, height, PAGE_MARGIN, PAGE_MARGIN, width, height);

    return readPuzzleString(recognizeGrid(context.getImageData(0, 0, page.width, page.height)));
};

const readInnerCells = (puzzleString: string): string =>
    Array.from(puzzleString)
        .filter((_, cell) => cell % GRID_SIZE > 0 && cell % GRID_SIZE < GRID_SIZE - 1 && cell >= GRID_SIZE && cell < CELL_COUNT - GRID_SIZE)
        .join('');

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

    it('should read a dark board with shaded cells and pencil marks exactly, without handwriting flags', () => {
        const index = gridFixtures.findIndex(fixture => fixture.file === 'app-ios-pencil-marks-dark.jpg');
        const recognition = recognitions[index];

        expect(puzzleStrings[index]).toBe(gridFixtures[index].expected);
        expect(recognition.kind === GridRecognitionKindEnum.RECOGNIZED ? recognition.handwritten.some(Boolean) : true).toBe(false);
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

    it.each([
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ])('should read a board cut off by the surrounding page at (%i, %i)', (directionX, directionY) => {
        const { canvas, margin, cellSize } = renderPrintedGrid(gridFixtures[0].expected);
        const hidden = Math.round(margin + HIDDEN_CELL_RATIO * cellSize);

        expect(readInnerCells(recognizeOnDarkPage(canvas, directionX * hidden, directionY * hidden))).toBe(
            readInnerCells(gridFixtures[0].expected)
        );
    });

    it.each([1, 2])('should leave cells that hold only pencil marks empty with every %i. clue printed', clueStep => {
        const puzzle = Array.from(gridFixtures[0].expected, (digit, cell) => (cell % clueStep === 0 ? digit : '.')).join('');
        const { canvas, context, margin, cellSize } = renderPrintedGrid(puzzle);

        context.resetTransform();
        context.font = `bold ${Math.round(PENCIL_MARK_CELL_RATIO * cellSize)}px sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        Array.from(puzzle).forEach((digit, cell) => {
            if (digit === '.') {
                ['2', '5', '8'].forEach((mark, row) => {
                    context.fillText(
                        mark,
                        margin + ((cell % GRID_SIZE) + 0.5) * cellSize,
                        margin + (Math.floor(cell / GRID_SIZE) + (2 * row + 1) / 6) * cellSize
                    );
                });
            }
        });

        expect(recognizeOnDarkPage(canvas, 0, 0).replaceAll(/\d/gu, '#')).toBe(puzzle.replaceAll(/\d/gu, '#'));
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
