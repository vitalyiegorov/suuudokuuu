import { givens as givensMask, solvedBoard } from '../../fixtures';
/* oxlint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { DIFFICULTY_CODE_MAX } from '../../../src/@generic/constants/binary-codec.constant';
import { GRID_CELL_COUNT, GRID_EMPTY_CELL } from '../../../src/@generic/constants/grid.constant';
import { SharedPayloadKindEnum } from '../../../src/@generic/enums/shared-payload-kind.enum';
import { TimelineEventKindEnum } from '../../../src/@generic/enums/timeline-event-kind.enum';
import { GameStateSerializer } from '../../../src/game-state-serializer/classes/game-state-serializer';

import type { SolutionStepInterface } from '../../../src/@generic/interfaces/solution-step.interface';
import type { TimelineEventInterface } from '../../../src/@generic/interfaces/timeline-event.interface';

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

describe('GameStateSerializer v3 encoded size characterization', () => {
    const serializer = new GameStateSerializer();

    const buildCellEvents = (): TimelineEventInterface[] =>
        buildStepsForEmptyCells().map(step => ({
            kind: TimelineEventKindEnum.Cell,
            cellIndex: step.cellIndex,
            value: step.value,
            ts: step.ts
        }));

    const buildPencilMarks = (cellCount: number): Record<string, number[]> => {
        const candidates: Record<string, number[]> = {};

        for (let cellIndex = 0; cellIndex < cellCount; cellIndex += 1) {
            candidates[cellIndex] = [1, 4, 7];
        }

        return candidates;
    };

    it('should keep a v3 puzzle share under 40 characters', () => {
        expect.assertions(1);

        const encoded = serializer.encodeState({
            field: givensMask,
            timelineEvents: [],
            kind: SharedPayloadKindEnum.Puzzle,
            maxMistakes: 3,
            isChallengeRun: false,
            score: 0,
            candidates: {},
            anchorSeconds: 0,
            pencilCount: 0,
            screenshotCount: 0,
            rating: 0,
            isRatingCeiling: false,
            difficulty: DIFFICULTY_CODE_MAX
        });

        expect(encoded.length).toBeLessThanOrEqual(40);
    });

    it('should keep a v3 challenge share with a technique stream under 240 characters', () => {
        expect.assertions(1);

        const encoded = serializer.encodeState({
            techniques: buildCellEvents().map((_, index) => index % 26),
            field: solvedBoard,
            timelineEvents: [
                ...buildCellEvents(),
                { kind: TimelineEventKindEnum.Away, ts: 4 },
                { kind: TimelineEventKindEnum.Return, ts: 300 },
                { kind: TimelineEventKindEnum.AutoCandidates, ts: 2 }
            ],
            kind: SharedPayloadKindEnum.Challenge,
            maxMistakes: 3,
            isChallengeRun: true,
            score: 0,
            candidates: {},
            anchorSeconds: 0,
            pencilCount: 0,
            screenshotCount: 0,
            rating: 0,
            isRatingCeiling: false,
            difficulty: DIFFICULTY_CODE_MAX
        });

        expect(encoded.length).toBeLessThanOrEqual(240);
    });

    it('should keep a v3 handoff share with pencil marks and a technique stream under 320 characters', () => {
        expect.assertions(2);

        const candidates = buildPencilMarks(18);
        const encoded = serializer.encodeState({
            techniques: buildCellEvents().map((_, index) => index % 26),
            field: solvedBoard,
            timelineEvents: buildCellEvents(),
            kind: SharedPayloadKindEnum.Handoff,
            maxMistakes: 3,
            isChallengeRun: true,
            score: 4820,
            candidates,
            anchorSeconds: 1800000000,
            pencilCount: 0,
            screenshotCount: 0,
            rating: 0,
            isRatingCeiling: false,
            difficulty: DIFFICULTY_CODE_MAX
        });

        expect(encoded.length).toBeLessThanOrEqual(320);
        expect(serializer.decodeState(encoded).candidates).toStrictEqual(candidates);
    });

    it('should keep every v3 payload url path safe', () => {
        expect.assertions(1);

        const encoded = serializer.encodeState({
            field: solvedBoard,
            timelineEvents: buildCellEvents(),
            kind: SharedPayloadKindEnum.Challenge,
            maxMistakes: 3,
            isChallengeRun: true,
            score: 0,
            candidates: {},
            anchorSeconds: 0,
            pencilCount: 0,
            screenshotCount: 0,
            rating: 0,
            isRatingCeiling: false,
            difficulty: DIFFICULTY_CODE_MAX
        });

        expect(encoded).toMatch(/^_[\w-]*$/u);
    });
});
