/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../@generic/constants/grid.constant';

import { GameStateBinaryCodec } from './game-state-binary-codec';

import type { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildStepsForEmptyCells = (): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        if (givensMask.charAt(cellIndex) === GRID_EMPTY_CELL) {
            steps.push({ cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts: cellIndex % 250 });
        }
    }

    return steps;
};

describe('GameStateBinaryCodec', () => {
    const codec = new GameStateBinaryCodec();

    describe('encode', () => {
        it('should produce a version-prefixed base64url string', () => {
            expect.assertions(1);

            const encoded = codec.encode(givensMask, [], 3, false);

            expect(encoded).toMatch(/^_[\w-]+$/u);
        });

        it('should throw for invalid field length', () => {
            expect.assertions(1);

            expect(() => codec.encode('.'.repeat(80), [], 3, false)).toThrow('Invalid sudoku field length');
        });

        it('should throw for a step outside the empty cells', () => {
            expect.assertions(1);

            const duplicatedSteps = [
                { cellIndex: 2, value: 4, ts: 1 },
                { cellIndex: 2, value: 4, ts: 1 }
            ];

            expect(() => codec.encode(givensMask, duplicatedSteps, 3, true)).toThrow('Invalid solution step cell');
        });

        it('should throw for invalid step values', () => {
            expect.assertions(1);

            const invalidValueSteps = [{ cellIndex: 2, value: 12, ts: 1 }];

            expect(() => codec.encode(givensMask, invalidValueSteps, 3, true)).toThrow('Invalid sudoku cell value');
        });
    });

    describe('decode', () => {
        it('should throw for unsupported version', () => {
            expect.assertions(1);

            expect(() => codec.decode('AAAA')).toThrow('Unsupported game state version');
        });

        it('should throw for invalid characters', () => {
            expect.assertions(1);

            expect(() => codec.decode('$$$$')).toThrow('Invalid base64url character');
        });

        it('should throw for truncated payloads', () => {
            expect.assertions(1);

            const encoded = codec.encode(solvedBoard, buildStepsForEmptyCells(), 3, true);
            const truncated = encoded.slice(1, Math.floor(encoded.length / 2));

            expect(() => codec.decode(truncated)).toThrow();
        });
    });

    describe('round-trip', () => {
        it('should round-trip a puzzle share without steps', () => {
            expect.assertions(1);

            const decoded = codec.decode(codec.encode(givensMask, [], 3, false).slice(1));

            expect(decoded).toEqual([givensMask, [], 3, false, 0]);
        });

        it('should round-trip a completed challenge with all steps', () => {
            expect.assertions(1);

            const steps = buildStepsForEmptyCells();
            const expectedElapsedTime = steps.reduce((total, step) => total + step.ts, 0);
            const decoded = codec.decode(codec.encode(solvedBoard, steps, 3, true).slice(1));

            expect(decoded).toEqual([givensMask, steps, 3, true, expectedElapsedTime]);
        });

        it('should round-trip a partially played challenge', () => {
            expect.assertions(1);

            const steps = buildStepsForEmptyCells().slice(0, 7);
            const decoded = codec.decode(codec.encode(givensMask, steps, 0, true).slice(1));

            expect(decoded[1]).toEqual(steps);
        });

        it('should round-trip a challenge without steps', () => {
            expect.assertions(1);

            const decoded = codec.decode(codec.encode(givensMask, [], 99, true).slice(1));

            expect(decoded).toEqual([givensMask, [], 99, true, 0]);
        });

        it('should round-trip an empty field', () => {
            expect.assertions(1);

            const emptyField = GRID_EMPTY_CELL.repeat(GRID_CELL_COUNT);
            const decoded = codec.decode(codec.encode(emptyField, [], 0, false).slice(1));

            expect(decoded[0]).toBe(emptyField);
        });

        it('should round-trip a fully filled field without steps', () => {
            expect.assertions(1);

            const decoded = codec.decode(codec.encode(solvedBoard, [], 3, false).slice(1));

            expect(decoded[0]).toBe(solvedBoard);
        });

        it('should round-trip boundary timestamps', () => {
            expect.assertions(1);

            const steps = [
                { cellIndex: 2, value: 4, ts: 0 },
                { cellIndex: 3, value: 6, ts: 255 }
            ];
            const decoded = codec.decode(codec.encode(givensMask, steps, 3, true).slice(1));

            expect(decoded[1]).toEqual(steps);
        });

        it('should clamp maxMistakes above the 8-bit limit', () => {
            expect.assertions(1);

            const decoded = codec.decode(codec.encode(givensMask, [], 999, false).slice(1));

            expect(decoded[2]).toBe(255);
        });

        it('should clamp step timestamps above the 8-bit limit', () => {
            expect.assertions(1);

            const steps = [{ cellIndex: 2, value: 4, ts: 9999 }];
            const decoded = codec.decode(codec.encode(givensMask, steps, 3, true).slice(1));

            expect(decoded[1]).toEqual([{ cellIndex: 2, value: 4, ts: 255 }]);
        });
    });

    describe('payload size', () => {
        it('should keep a puzzle-only payload under 40 characters', () => {
            expect.assertions(1);

            expect(codec.encode(givensMask, [], 3, false).length).toBeLessThanOrEqual(40);
        });

        it('should keep a completed challenge payload under 180 characters', () => {
            expect.assertions(1);

            expect(codec.encode(solvedBoard, buildStepsForEmptyCells(), 3, true).length).toBeLessThanOrEqual(180);
        });
    });
});
