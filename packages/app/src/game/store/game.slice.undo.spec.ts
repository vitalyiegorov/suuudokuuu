import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';

import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { GameCellTimelineEventInterface } from '../interface/game-timeline-event.interface';

const { undo, redo, toggleCellCandidate, hint } = gameSlice.actions;

const placedSudokuString = '534.7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const undoneSudokuString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const placementEvent: GameCellTimelineEventInterface = {
    kind: TimelineEventKindEnum.Cell,
    cellIndex: 3,
    value: 4,
    ts: 12,
    score: 60,
    technique: SolutionTechniqueEnum.NakedSingle
};

const undoPenalty = new SudokuScoring(defaultScoringConfig).calculateUndoPenalty({
    difficulty: DifficultyEnum.Medium,
    maxMistakes: 3
});

const buildRun = (overrides: Partial<GameState> = {}): GameState => ({
    ...initialGameState,
    sudokuString: placedSudokuString,
    difficulty: DifficultyEnum.Medium,
    maxMistakes: 3,
    score: 500,
    elapsedTime: 40,
    candidates: { '0-3': [] },
    timelineEvents: [placementEvent],
    techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 1 },
    ...overrides
});

const undoPayload = { sudokuString: undoneSudokuString, candidates: { '0-3': [4, 8] } };
const redoPayload = { sudokuString: placedSudokuString, candidates: { '0-3': [] } };

describe('gameSlice undo', () => {
    it('mirrors the engine field state into the persisted run', () => {
        expect.assertions(2);

        const state = gameSlice.reducer(buildRun(), undo(undoPayload));

        expect(state.sudokuString).toBe(undoneSudokuString);
        expect(state.candidates).toStrictEqual({ '0-3': [4, 8] });
    });

    it('returns the points the undone placement earned and charges the undo penalty', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun(), undo(undoPayload));

        expect(state.score).toBe(500 - 60 - undoPenalty);
    });

    it('moves the undone placement out of the timeline and into the redo stack', () => {
        expect.assertions(2);

        const state = gameSlice.reducer(buildRun(), undo(undoPayload));

        expect(state.timelineEvents).toStrictEqual([]);
        expect(state.undoneMoves).toStrictEqual([placementEvent]);
    });

    it('carries the think time of the removed placement into the following event', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(
            buildRun({ timelineEvents: [placementEvent, { kind: TimelineEventKindEnum.Hint, ts: 5 }] }),
            undo(undoPayload)
        );

        expect(state.timelineEvents).toStrictEqual([{ kind: TimelineEventKindEnum.Hint, ts: 17 }]);
    });

    it('drops the technique usage entry when the undone placement was its only use', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun(), undo(undoPayload));

        expect(state.techniqueUsageCounts).toStrictEqual({});
    });

    it('decrements the technique usage count when the technique was used before', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun({ techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 3 } }), undo(undoPayload));

        expect(state.techniqueUsageCounts).toStrictEqual({ [SolutionTechniqueEnum.NakedSingle]: 2 });
    });

    it('never pushes the score below zero', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun({ score: 10 }), undo(undoPayload));

        expect(state.score).toBe(0);
    });

    it('charges nothing and keeps the timeline when only notes changed', () => {
        expect.assertions(4);

        const state = gameSlice.reducer(buildRun(), undo({ sudokuString: placedSudokuString, candidates: { '1-1': [7] } }));

        expect(state.score).toBe(500);
        expect(state.timelineEvents).toStrictEqual([placementEvent]);
        expect(state.undoneMoves).toStrictEqual([]);
        expect(state.candidates).toStrictEqual({ '1-1': [7] });
    });

    it('never decrements the mistake count', () => {
        expect.assertions(1);

        const state = gameSlice.reducer(buildRun({ mistakes: 2 }), undo(undoPayload));

        expect(state.mistakes).toBe(2);
    });

    it('leaves the score untouched when the timeline carries no placement to take back', () => {
        expect.assertions(2);

        const state = gameSlice.reducer(buildRun({ timelineEvents: [{ kind: TimelineEventKindEnum.Hint, ts: 4 }] }), undo(undoPayload));

        expect(state.score).toBe(500);
        expect(state.undoneMoves).toStrictEqual([]);
    });

    it('charges only the penalty for a legacy placement without a recorded score', () => {
        expect.assertions(1);

        const legacyEvent = { kind: TimelineEventKindEnum.Cell, cellIndex: 3, value: 4, ts: 12 } as const;
        const state = gameSlice.reducer(buildRun({ timelineEvents: [legacyEvent], techniqueUsageCounts: {} }), undo(undoPayload));

        expect(state.score).toBe(500 - undoPenalty);
    });
});

describe('gameSlice redo', () => {
    it('replays the undone placement with its score and a fresh think time', () => {
        expect.assertions(4);

        const undoneState = gameSlice.reducer(buildRun(), undo(undoPayload));
        const state = gameSlice.reducer(undoneState, redo(redoPayload));

        expect(state.sudokuString).toBe(placedSudokuString);
        expect(state.score).toBe(500 - undoPenalty);
        expect(state.undoneMoves).toStrictEqual([]);
        expect(state.timelineEvents).toStrictEqual([{ ...placementEvent, ts: 40 }]);
    });

    it('restores the technique usage count of the replayed placement', () => {
        expect.assertions(1);

        const undoneState = gameSlice.reducer(buildRun(), undo(undoPayload));
        const state = gameSlice.reducer(undoneState, redo(redoPayload));

        expect(state.techniqueUsageCounts).toStrictEqual({ [SolutionTechniqueEnum.NakedSingle]: 1 });
    });

    it('only mirrors the field state when the replayed step changed nothing but notes', () => {
        expect.assertions(3);

        const undoneState = gameSlice.reducer(buildRun(), undo(undoPayload));
        const state = gameSlice.reducer(undoneState, redo({ sudokuString: undoneSudokuString, candidates: { '0-3': [4] } }));

        expect(state.candidates).toStrictEqual({ '0-3': [4] });
        expect(state.undoneMoves).toStrictEqual([placementEvent]);
        expect(state.timelineEvents).toStrictEqual([]);
    });

    it('replays a legacy placement without a recorded score or technique', () => {
        expect.assertions(3);

        const legacyEvent = { kind: TimelineEventKindEnum.Cell, cellIndex: 3, value: 4, ts: 12 } as const;
        const undoneState = gameSlice.reducer(buildRun({ timelineEvents: [legacyEvent], techniqueUsageCounts: {} }), undo(undoPayload));
        const state = gameSlice.reducer(undoneState, redo(redoPayload));

        expect(state.score).toBe(500 - undoPenalty);
        expect(state.techniqueUsageCounts).toStrictEqual({});
        expect(state.timelineEvents).toStrictEqual([{ ...legacyEvent, ts: 40 }]);
    });

    it('stays inert when there is no undone placement to replay', () => {
        expect.assertions(2);

        const state = gameSlice.reducer(buildRun({ sudokuString: undoneSudokuString }), redo(redoPayload));

        expect(state.score).toBe(500);
        expect(state.timelineEvents).toStrictEqual([placementEvent]);
    });
});

describe('gameSlice redo invalidation', () => {
    it('drops the redo stack when a note is edited', () => {
        expect.assertions(1);

        const undoneState = gameSlice.reducer(buildRun(), undo(undoPayload));
        const state = gameSlice.reducer(
            undoneState,
            toggleCellCandidate({ cell: { x: 1, y: 1, group: 0, value: 5 }, candidates: { '1-1': [5] } })
        );

        expect(state.undoneMoves).toStrictEqual([]);
    });

    it('drops the redo stack when a hint is applied', () => {
        expect.assertions(1);

        const undoneState = gameSlice.reducer(buildRun(), undo(undoPayload));
        const state = gameSlice.reducer(undoneState, hint({ eliminations: [] }));

        expect(state.undoneMoves).toStrictEqual([]);
    });
});
