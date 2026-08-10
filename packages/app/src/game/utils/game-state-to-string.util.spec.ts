/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { initialGameState } from '../store/game.state';

import { gameStateToString } from './game-state-to-string.util';

import type { GameTimelineEventInterface } from '../interface/game-timeline-event.interface';
import type { GameState } from '../store/game.state';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givensMask = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const BlankCell = '.';

const buildCellEvents = (count: number): GameTimelineEventInterface[] => {
    const events: GameTimelineEventInterface[] = [];

    for (let cellIndex = 0; cellIndex < givensMask.length && events.length < count; cellIndex += 1) {
        if (givensMask.charAt(cellIndex) === BlankCell) {
            events.push({
                kind: TimelineEventKindEnum.Cell,
                cellIndex,
                value: parseInt(solvedBoard.charAt(cellIndex), 10),
                ts: 10
            });
        }
    }

    return events;
};

const buildGameState = (timelineEvents: GameTimelineEventInterface[], overrides: Partial<GameState> = {}): GameState => ({
    ...initialGameState,
    sudokuString: solvedBoard,
    maxMistakes: 3,
    timelineEvents,
    ...overrides
});

describe('gameStateToString', () => {
    const serializer = new GameStateSerializer();

    it('should return an empty string when the field cannot be encoded', () => {
        expect.assertions(1);

        expect(gameStateToString(initialGameState)).toBe('');
    });

    it('should strip the played values from a puzzle share', () => {
        expect.assertions(2);

        const encoded = gameStateToString(buildGameState(buildCellEvents(5)), SharedPayloadKindEnum.Puzzle);
        const decoded = serializer.decodeState(encoded);

        expect(decoded.kind).toBe(SharedPayloadKindEnum.Puzzle);
        expect(decoded.timelineEvents).toStrictEqual([]);
    });

    it('should carry cell events in a challenge share', () => {
        expect.assertions(2);

        const events = buildCellEvents(4);
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(decoded.kind).toBe(SharedPayloadKindEnum.Challenge);
        expect(decoded.timelineEvents).toStrictEqual(events);
    });

    it('should carry away and return markers in a challenge share', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            ...buildCellEvents(1),
            { kind: TimelineEventKindEnum.Away, ts: 2 },
            { kind: TimelineEventKindEnum.Return, ts: 400 }
        ];
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(decoded.timelineEvents).toStrictEqual(events);
    });

    it('should drop the local only event kinds from the payload while keeping their elapsed time', () => {
        expect.assertions(2);

        const [cellEvent] = buildCellEvents(1);
        const events: GameTimelineEventInterface[] = [
            cellEvent,
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 3, value: 7, ts: 1 },
            { kind: TimelineEventKindEnum.InputMode, ts: 1 },
            { kind: TimelineEventKindEnum.Pause, ts: 1 },
            { kind: TimelineEventKindEnum.Resume, ts: 1 }
        ];
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(decoded.timelineEvents).toStrictEqual([{ ...cellEvent, ts: 14 }]);
        expect(decoded.elapsedTime).toBe(14);
    });

    it('should preserve the full elapsed time when pencil events sit between shared events', () => {
        expect.assertions(2);

        const [firstCellEvent, secondCellEvent] = buildCellEvents(2);
        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 3, value: 7, ts: 60 },
            firstCellEvent,
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 5, value: 2, ts: 200 },
            secondCellEvent
        ];
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(decoded.elapsedTime).toBe(280);
        expect(decoded.timelineEvents).toStrictEqual([
            { ...firstCellEvent, ts: 70 },
            { ...secondCellEvent, ts: 210 }
        ]);
    });

    it('should keep the auto candidates assist marker in the payload', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.AutoCandidates, ts: 4 }];
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(decoded.timelineEvents).toStrictEqual(events);
    });

    it('should not carry the locally derived technique into the payload', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 10, technique: SolutionTechniqueEnum.NakedSingle }
        ];
        const decoded = serializer.decodeState(gameStateToString(buildGameState(events), SharedPayloadKindEnum.Challenge));

        expect(Object.keys(decoded.timelineEvents[0])).toStrictEqual(['kind', 'cellIndex', 'value', 'ts']);
    });

    it('should carry score and pencil marks in a handoff share', () => {
        expect.assertions(2);

        const state = buildGameState(buildCellEvents(2), { score: 4820, candidates: { '4-4': [2, 6] } });
        const decoded = serializer.decodeState(gameStateToString(state, SharedPayloadKindEnum.Handoff));

        expect(decoded.score).toBe(4820);
        expect(decoded.candidates).toStrictEqual({ 40: [2, 6] });
    });

    it('should carry the computed rating and ceiling flag into the payload', () => {
        expect.assertions(2);

        const state = buildGameState([], { rating: 3.4, isRatingCeiling: false });
        const decoded = serializer.decodeState(gameStateToString(state, SharedPayloadKindEnum.Puzzle));

        expect(decoded.rating).toBe(34);
        expect(decoded.isRatingCeiling).toBe(false);
    });

    it('should carry a ceiling rating into the payload', () => {
        expect.assertions(2);

        const state = buildGameState([], { rating: 5.4, isRatingCeiling: true });
        const decoded = serializer.decodeState(gameStateToString(state, SharedPayloadKindEnum.Puzzle));

        expect(decoded.rating).toBe(54);
        expect(decoded.isRatingCeiling).toBe(true);
    });

    it('should encode the unknown rating sentinel for a puzzle without a computed rating', () => {
        expect.assertions(2);

        const decoded = serializer.decodeState(gameStateToString(buildGameState([]), SharedPayloadKindEnum.Puzzle));

        expect(decoded.rating).toBe(0);
        expect(decoded.isRatingCeiling).toBe(false);
    });

    it('should encode the Infinity difficulty as the highest ordinal', () => {
        expect.assertions(1);

        const state = buildGameState([], { difficulty: DifficultyEnum.Infinity });
        const decoded = serializer.decodeState(gameStateToString(state, SharedPayloadKindEnum.Puzzle));

        expect(decoded.difficulty).toBe(7);
    });
});
