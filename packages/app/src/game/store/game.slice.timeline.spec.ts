import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';

const buildChallengeRun = (overrides: Partial<GameState> = {}): GameState => ({
    ...initialGameState,
    sudokuString: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
    isChallengeRun: true,
    ...overrides
});

const { timelineAway, timelineReturn, toggleShowAutoCandidates, toggleCellCandidate, pause } = gameSlice.actions;

const candidateCell = { x: 3, y: 2, value: 7, group: 1 };

describe('gameSlice timeline events', () => {
    describe('away', () => {
        it('should record an away event with the think time before leaving', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ elapsedTime: 12 }), timelineAway());

            expect(state.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.Away, ts: 12 }]);
        });

        it('should not record an away event outside a challenge run', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ isChallengeRun: false, elapsedTime: 12 }), timelineAway());

            expect(state.timelineEvents).toStrictEqual([]);
        });

        it('should not record a second away event for one departure', () => {
            expect.assertions(1);

            const firstState = gameSlice.reducer(buildChallengeRun({ elapsedTime: 12 }), timelineAway());
            const secondState = gameSlice.reducer(firstState, timelineAway());

            expect(secondState.timelineEvents).toHaveLength(1);
        });
    });

    describe('return', () => {
        it('should record the away duration as the return delta', () => {
            expect.assertions(1);

            const awayState = gameSlice.reducer(buildChallengeRun({ elapsedTime: 10 }), timelineAway());
            const returnedState = gameSlice.reducer({ ...awayState, elapsedTime: 320 }, timelineReturn());

            expect(returnedState.timelineEvents).toStrictEqual([
                { kind: TimelineEventKindEnum.Away, ts: 10 },
                { kind: TimelineEventKindEnum.Return, ts: 310 }
            ]);
        });

        it('should drop a sub-second blip instead of recording it', () => {
            expect.assertions(1);

            const awayState = gameSlice.reducer(buildChallengeRun({ elapsedTime: 10 }), timelineAway());
            const returnedState = gameSlice.reducer(awayState, timelineReturn());

            expect(returnedState.timelineEvents).toStrictEqual([]);
        });

        it('should ignore a return that follows no away event', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ elapsedTime: 10 }), timelineReturn());

            expect(state.timelineEvents).toStrictEqual([]);
        });

        it('should heal a dangling away event left by a killed process', () => {
            expect.assertions(1);

            const dangling = buildChallengeRun({
                elapsedTime: 500,
                timelineEvents: [{ kind: TimelineEventKindEnum.Away, ts: 20 }]
            });
            const healed = gameSlice.reducer(dangling, timelineReturn());

            expect(healed.timelineEvents).toStrictEqual([
                { kind: TimelineEventKindEnum.Away, ts: 20 },
                { kind: TimelineEventKindEnum.Return, ts: 480 }
            ]);
        });
    });

    describe('pause guard', () => {
        it('should refuse to pause a self authored challenge run with no rival', () => {
            expect.assertions(2);

            const state = gameSlice.reducer(buildChallengeRun(), pause());

            expect(state.isPaused).toBe(false);
            expect(state.shouldShowPauseScreen).toBe(false);
        });

        it('should still pause an ordinary run', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ isChallengeRun: false }), pause());

            expect(state.isPaused).toBe(true);
        });
    });

    describe('pencil actions', () => {
        it('should record a pencil action with the think time before it', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ elapsedTime: 18 }), toggleCellCandidate(candidateCell));

            expect(state.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.Pencil, cellIndex: 21, value: 7, ts: 18 }]);
        });

        it('should record erasing a candidate as another pencil action', () => {
            expect.assertions(1);

            const penciled = gameSlice.reducer(buildChallengeRun({ elapsedTime: 18 }), toggleCellCandidate(candidateCell));
            const erased = gameSlice.reducer({ ...penciled, elapsedTime: 25 }, toggleCellCandidate(candidateCell));

            expect(erased.timelineEvents).toStrictEqual([
                { kind: TimelineEventKindEnum.Pencil, cellIndex: 21, value: 7, ts: 18 },
                { kind: TimelineEventKindEnum.Pencil, cellIndex: 21, value: 7, ts: 7 }
            ]);
        });

        it('should still toggle the candidate it records', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ elapsedTime: 18 }), toggleCellCandidate(candidateCell));

            expect(state.candidates['2-3']).toStrictEqual([7]);
        });

        it('should not record pencil actions outside a challenge run', () => {
            expect.assertions(2);

            const state = gameSlice.reducer(
                buildChallengeRun({ isChallengeRun: false, elapsedTime: 18 }),
                toggleCellCandidate(candidateCell)
            );

            expect(state.timelineEvents).toStrictEqual([]);
            expect(state.candidates['2-3']).toStrictEqual([7]);
        });
    });

    describe('auto candidates assist', () => {
        it('should record the first activation with its timestamp', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ elapsedTime: 40 }), toggleShowAutoCandidates());

            expect(state.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.AutoCandidates, ts: 40 }]);
        });

        it('should record the assist only once per run however often it is toggled', () => {
            expect.assertions(1);

            const firstOn = gameSlice.reducer(buildChallengeRun({ elapsedTime: 40 }), toggleShowAutoCandidates());
            const off = gameSlice.reducer(firstOn, toggleShowAutoCandidates());
            const secondOn = gameSlice.reducer({ ...off, elapsedTime: 90 }, toggleShowAutoCandidates());

            expect(secondOn.timelineEvents).toHaveLength(1);
        });

        it('should not record anything when the assist is switched off', () => {
            expect.assertions(1);

            const state = gameSlice.reducer(buildChallengeRun({ showAutoCandidates: true }), toggleShowAutoCandidates());

            expect(state.timelineEvents).toStrictEqual([]);
        });
    });
});
