import { describe, expect, it, jest } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

jest.mock('@suuudokuuu/encoder', () => {
    const actual = jest.requireActual<typeof import('@suuudokuuu/encoder')>('@suuudokuuu/encoder');

    return {
        ...actual,
        GameStateSerializer: jest.fn(() => ({
            encodeState: jest.fn(() => '')
        }))
    };
});

import { createAppTestStore } from '../../@generic/utils/create-app-test-store.mock';
import { gameGetFieldStatePayload } from '../utils/game-get-field-state-payload.util';
import { gameGetSavePayload } from '../utils/game-get-save-payload.util';

import {
    gameFinishAction,
    gameMistakeAction,
    gameRedoAction,
    gameSaveAction,
    gameToggleAutoCandidatesAction,
    gameToggleCellCandidateAction,
    gameToggleInputModeAction,
    gameUndoAction
} from './game.actions';

import type { GameState } from './game.state';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const solvedPuzzle = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const lastCellIndex = 80;

const persistedReleaseState: Partial<GameState> = {
    sudokuString: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',
    difficulty: DifficultyEnum.Nightmare,
    candidates: { '0-2': [1, 2, 4], '2-0': [1, 2] },
    inputMode: 'candidate',
    showAutoCandidates: false,
    mistakes: 1,
    maxMistakes: 3,
    score: 1200,
    elapsedTime: 240
};

const buildEngine = (game: GameState): FieldEngine =>
    new FieldEngine({
        sudokuString: game.sudokuString,
        difficulty: game.difficulty,
        candidates: game.candidates,
        inputMode: game.inputMode,
        showAutoCandidates: game.showAutoCandidates,
        mistakes: game.mistakes
    });

const findBlankCell = (sudoku: Sudoku): CellInterface => {
    const blankCell = sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));

    if (!isDefined(blankCell)) {
        throw new Error('Expected the fixture puzzle to contain a blank cell');
    }

    return blankCell;
};

describe('field engine and persisted game state', () => {
    it('rehydrates a persisted release-format state into an equivalent engine', () => {
        const store = createAppTestStore({ game: persistedReleaseState });
        const engine = buildEngine(store.getState().game);
        const serialized = engine.serialize();

        expect(serialized.sudokuString).toBe(persistedReleaseState.sudokuString);
        expect(serialized.candidates).toStrictEqual(persistedReleaseState.candidates);
        expect(serialized.inputMode).toBe('candidate');
        expect(serialized.showAutoCandidates).toBe(false);
        expect(serialized.mistakes).toBe(1);
        expect(engine.getSnapshot().difficulty).toBe(DifficultyEnum.Nightmare);
        expect(engine.getCellCandidates(engine.Sudoku.Field[0][2])).toStrictEqual([1, 2, 4]);
    });

    it('keeps the persisted mirror identical to engine state across notes, mode and placement edits', () => {
        const store = createAppTestStore({ game: persistedReleaseState });
        const engine = buildEngine(store.getState().game);
        const [firstRow] = engine.Sudoku.Field;
        const [, , noteCell] = firstRow;

        engine.toggleCandidate(noteCell, 7);
        store.dispatch(gameToggleCellCandidateAction({ ...noteCell, value: 7 }));

        engine.toggleCandidate(noteCell, 1);
        store.dispatch(gameToggleCellCandidateAction({ ...noteCell, value: 1 }));

        engine.toggleInputMode();
        store.dispatch(gameToggleInputModeAction());

        engine.toggleShowAutoCandidates();
        store.dispatch(gameToggleAutoCandidatesAction());

        const blankCell = findBlankCell(engine.Sudoku);

        engine.selectCell(blankCell);

        const move = engine.inputValue(engine.Sudoku.getCorrectValue(blankCell));

        if (!isDefined(move)) {
            throw new Error('Expected the engine to apply the scripted placement');
        }

        store.dispatch(gameSaveAction(gameGetSavePayload(engine.Sudoku, move)));

        const serialized = engine.serialize();
        const { game } = store.getState();

        expect(game.candidates).toStrictEqual(serialized.candidates);
        expect(game.inputMode).toBe(serialized.inputMode);
        expect(game.showAutoCandidates).toBe(serialized.showAutoCandidates);
        expect(game.sudokuString).toBe(serialized.sudokuString);
    });

    it('drives scoring, mistakes and the timeline from engine events', () => {
        const store = createAppTestStore({
            game: { ...persistedReleaseState, elapsedTime: 5, inputMode: 'normal', mistakes: 0, score: 0 }
        });
        const engine = buildEngine(store.getState().game);

        engine.on('moveApplied', appliedMove => void store.dispatch(gameSaveAction(gameGetSavePayload(engine.Sudoku, appliedMove))));
        engine.on('mistake', mistake => void store.dispatch(gameMistakeAction(mistake.cell)));

        const blankCell = findBlankCell(engine.Sudoku);
        const correctValue = engine.Sudoku.getCorrectValue(blankCell);
        const wrongValue = correctValue === 1 ? 2 : 1;

        engine.selectCell(blankCell);
        engine.inputValue(wrongValue);

        expect(store.getState().game.mistakes).toBe(1);
        expect(store.getState().game.timelineEvents).toStrictEqual([
            {
                kind: TimelineEventKindEnum.Mistake,
                cellIndex: blankCell.y * 9 + blankCell.x,
                value: wrongValue,
                ts: 5
            }
        ]);

        engine.inputValue(correctValue);

        const [, cellEvent] = store.getState().game.timelineEvents;

        expect(store.getState().game.score).toBeGreaterThan(0);
        expect(store.getState().game.sudokuString).toBe(engine.serialize().sudokuString);
        expect(cellEvent).toMatchObject({
            kind: TimelineEventKindEnum.Cell,
            cellIndex: blankCell.y * 9 + blankCell.x,
            value: correctValue
        });
        expect(cellEvent).toHaveProperty('technique');
    });

    it('keeps the persisted mirror identical to engine state across undo and redo', () => {
        expect.assertions(9);

        const store = createAppTestStore({ game: { ...persistedReleaseState, inputMode: 'normal' } });
        const engine = buildEngine(store.getState().game);

        engine.on('moveApplied', appliedMove => void store.dispatch(gameSaveAction(gameGetSavePayload(engine.Sudoku, appliedMove))));

        const blankCell = findBlankCell(engine.Sudoku);

        engine.selectCell(blankCell);
        engine.inputValue(engine.Sudoku.getCorrectValue(blankCell));

        const scoreAfterPlacement = store.getState().game.score;

        expect(engine.getSnapshot().canUndo).toBe(true);
        expect(engine.undo()).toBe(true);

        store.dispatch(gameUndoAction(gameGetFieldStatePayload(engine)));

        const undoneSerialized = engine.serialize();
        const undoneGame = store.getState().game;

        expect(undoneGame.sudokuString).toBe(undoneSerialized.sudokuString);
        expect(undoneGame.candidates).toStrictEqual(undoneSerialized.candidates);
        expect(undoneGame.score).toBeLessThan(scoreAfterPlacement);

        expect(engine.redo()).toBe(true);

        store.dispatch(gameRedoAction(gameGetFieldStatePayload(engine)));

        const redoneSerialized = engine.serialize();
        const redoneGame = store.getState().game;

        expect(redoneGame.sudokuString).toBe(redoneSerialized.sudokuString);
        expect(redoneGame.candidates).toStrictEqual(redoneSerialized.candidates);
        expect(redoneGame.timelineEvents).toHaveLength(1);
    });

    it('keeps the persisted mirror identical to engine state when a note edit is undone', () => {
        expect.assertions(3);

        const store = createAppTestStore({ game: { ...persistedReleaseState, inputMode: 'candidate' } });
        const engine = buildEngine(store.getState().game);
        const [firstRow] = engine.Sudoku.Field;
        const [, , noteCell] = firstRow;

        engine.toggleCandidate(noteCell, 9);
        store.dispatch(gameToggleCellCandidateAction({ ...noteCell, value: 9 }));

        engine.undo();
        store.dispatch(gameUndoAction(gameGetFieldStatePayload(engine)));

        const serialized = engine.serialize();
        const { game } = store.getState();

        expect(game.candidates).toStrictEqual(serialized.candidates);
        expect(game.sudokuString).toBe(serialized.sudokuString);
        expect(game.score).toBe(persistedReleaseState.score);
    });

    it('finishes the run from the engine completed event', () => {
        const almostSolvedPuzzle = `${solvedPuzzle.slice(0, lastCellIndex)}.`;
        const store = createAppTestStore({
            game: {
                ...persistedReleaseState,
                sudokuString: almostSolvedPuzzle,
                candidates: {},
                difficulty: DifficultyEnum.Easy,
                elapsedTime: 9,
                inputMode: 'normal'
            }
        });
        const engine = buildEngine(store.getState().game);

        engine.on('moveApplied', appliedMove => void store.dispatch(gameSaveAction(gameGetSavePayload(engine.Sudoku, appliedMove))));
        engine.on('completed', () => void store.dispatch(gameFinishAction({ difficulty: DifficultyEnum.Easy, isWon: true })));

        engine.selectCell(engine.Sudoku.Field[8][8]);
        engine.inputValue(9);

        const { game } = store.getState();

        expect(game.sudokuString).toBe(solvedPuzzle);
        expect(game.historyByDifficulty[DifficultyEnum.Easy].gamesWon).toBe(1);
        expect(game.historyByDifficulty[DifficultyEnum.Easy].bestTime).toBe(9);
        expect(game.isPaused).toBe(true);
    });
});
