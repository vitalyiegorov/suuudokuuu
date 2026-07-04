/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../constants/grid.constant';

import { GameStateSerializer } from './game-state-serializer';

import type { SolutionStepInterface } from '../../interfaces/solution-step.interface';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildStepsForEmptyCells = (): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (let cellIndex = 0; cellIndex < GRID_CELL_COUNT; cellIndex += 1) {
        if (givensMask.charAt(cellIndex) === GRID_EMPTY_CELL) {
            steps.push({ cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts: 12 });
        }
    }

    return steps;
};

describe('GameStateSerializer encoded size characterization', () => {
    const serializer = new GameStateSerializer();

    it('should round-trip a fully played challenge with 51 steps', () => {
        expect.assertions(3);

        const steps = buildStepsForEmptyCells();
        const encoded = serializer.encode(solvedBoard, steps, 3, true);
        const decoded = serializer.decode(encoded);

        expect(decoded[0]).toBe(givensMask);
        expect(decoded[1]).toEqual(steps);
        expect(decoded[3]).toBe(true);
    });

    it('should document the encoded length of a puzzle-only share', () => {
        expect.assertions(1);

        const encoded = serializer.encode(givensMask, [], 3, false);

        expect(encoded.length).toBeLessThanOrEqual(40);
    });

    it('should document the encoded length of a completed challenge share', () => {
        expect.assertions(1);

        const steps = buildStepsForEmptyCells();
        const encoded = serializer.encode(solvedBoard, steps, 3, true);

        expect(encoded.length).toBeLessThanOrEqual(180);
    });

    it('should only produce URL path safe unreserved characters', () => {
        expect.assertions(1);

        const steps = buildStepsForEmptyCells();
        const encoded = serializer.encode(solvedBoard, steps, 3, true);

        expect(encoded).toMatch(/^[\w-]*$/u);
    });
});
