import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { gameRedoAction, gameStartAction, gameToggleCellCandidateAction, gameUndoAction } from './game.actions';
import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameSnapshotInterface } from '../interface/game-snapshot.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const PuzzleStringLengthConstant = 81;
const cell: CellInterface = { x: 0, y: 0, group: 0, value: 5 };

const stateWithCandidates = (candidates: Record<string, number[]>, score = 100) => ({
    ...initialGameState,
    sudokuString: ' '.repeat(PuzzleStringLengthConstant),
    score,
    candidates
});

const toggleCandidate = (state: ReturnType<typeof stateWithCandidates>) =>
    gameSlice.reducer(state, gameToggleCellCandidateAction({ ...cell, value: 7 }));

describe('gameSlice undo/redo', () => {
    it('restores previous candidates on undo and reapplies them on redo', () => {
        expect.assertions(4);

        const before = stateWithCandidates({ '0-0': [1, 2] });
        const afterToggle = toggleCandidate(before);

        expect(afterToggle.candidates['0-0']).toStrictEqual([1, 2, 7]);
        expect(afterToggle.undoStack).toHaveLength(1);

        const afterUndo = gameSlice.reducer(afterToggle, gameUndoAction());
        const afterRedo = gameSlice.reducer(afterUndo, gameRedoAction());

        expect(afterUndo.candidates['0-0']).toStrictEqual([1, 2]);
        expect(afterRedo.candidates['0-0']).toStrictEqual([1, 2, 7]);
    });

    it('deducts the undo coefficient penalty on undo and refunds it on redo', () => {
        expect.assertions(3);

        const afterToggle = toggleCandidate(stateWithCandidates({}, 100));
        const penalty = Math.floor(100 * 0.1);

        const afterUndo = gameSlice.reducer(afterToggle, gameUndoAction());
        const afterRedo = gameSlice.reducer(afterUndo, gameRedoAction());

        expect(afterUndo.score).toBe(100 - penalty);
        expect(afterUndo.lastUndoScorePenalty).toBe(penalty);
        expect(afterRedo.score).toBe(100);
    });

    it('is a no-op with an empty undo stack', () => {
        expect.assertions(2);

        const state = stateWithCandidates({});
        const afterUndo = gameSlice.reducer(state, gameUndoAction());

        expect(afterUndo.candidates).toBe(state.candidates);
        expect(afterUndo.score).toBe(state.score);
    });

    it('is disabled during challenge runs', () => {
        expect.assertions(2);

        const challengeState = toggleCandidate({ ...stateWithCandidates({}), isChallengeRun: true });
        const snapshot: GameSnapshotInterface = {
            sudokuString: 'x'.repeat(PuzzleStringLengthConstant),
            candidates: {}
        };

        const afterUndo = gameSlice.reducer({ ...challengeState, undoStack: [snapshot] }, gameUndoAction());
        const afterRedo = gameSlice.reducer({ ...challengeState, redoStack: [snapshot] }, gameRedoAction());

        expect(afterUndo.sudokuString).toBe(challengeState.sudokuString);
        expect(afterRedo.sudokuString).toBe(challengeState.sudokuString);
    });

    it('is disabled in hardcore mode', () => {
        expect.assertions(2);

        const hardcoreState = toggleCandidate({ ...stateWithCandidates({}), maxMistakes: 0 });
        const snapshot: GameSnapshotInterface = {
            sudokuString: 'x'.repeat(PuzzleStringLengthConstant),
            candidates: {}
        };

        const afterUndo = gameSlice.reducer({ ...hardcoreState, undoStack: [snapshot] }, gameUndoAction());
        const afterRedo = gameSlice.reducer({ ...hardcoreState, redoStack: [snapshot] }, gameRedoAction());

        expect(afterUndo.sudokuString).toBe(hardcoreState.sudokuString);
        expect(afterRedo.sudokuString).toBe(hardcoreState.sudokuString);
    });

    it('clears the redo stack on a new move', () => {
        expect.assertions(2);

        const firstToggle = toggleCandidate(stateWithCandidates({}));
        const undone = gameSlice.reducer(firstToggle, gameUndoAction());
        expect(undone.redoStack).toHaveLength(1);

        const newMove = gameSlice.reducer(undone, gameToggleCellCandidateAction({ ...cell, value: 3 }));

        expect(newMove.redoStack).toHaveLength(0);
    });

    it('resets stacks on start', () => {
        expect.assertions(1);

        const started = gameSlice.reducer(
            toggleCandidate(stateWithCandidates({})),
            gameStartAction({
                sudokuString: ' '.repeat(PuzzleStringLengthConstant),
                difficulty: DifficultyEnum.Easy,
                maxMistakes: 3,
                isChallengeRun: false,
                rating: 0,
                isRatingCeiling: false
            })
        );

        expect(started.undoStack).toHaveLength(0);
    });
});
