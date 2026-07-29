import { describe, expect, it, jest } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, Sudoku, emptyScoredCells } from '@suuudokuuu/generator';

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

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import {
    gameChallengeClockSyncAction,
    gameFinishAction,
    gameLoadAction,
    gameMistakeAction,
    gamePauseAction,
    gameResetAction,
    gameResumeAction,
    gameSaveAction,
    gameStartAction,
    gameTickAction,
    gameToggleAutoCandidatesAction,
    gameToggleCellCandidateAction,
    gameToggleInputModeAction
} from './game.actions';
import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

const StartedSudokuString = 'started-sudoku';
const InitialElapsedTime = 42;

describe('gameSlice', () => {
    it('starts a new puzzle while preserving completed history', () => {
        const historyByDifficulty = {
            ...initialGameState.historyByDifficulty,
            [DifficultyEnum.Easy]: {
                ...initialGameState.historyByDifficulty[DifficultyEnum.Easy],
                gamesCompleted: 3
            }
        };
        const dirtyState = {
            ...initialGameState,
            historyByDifficulty,
            elapsedTime: InitialElapsedTime,
            mistakes: 2,
            score: 100,
            showAutoCandidates: true,
            inputMode: 'candidate' as const,
            hasNewPersonalBestScore: true,
            candidates: { '1-1': [1, 2] }
        };

        const nextState = gameSlice.reducer(
            dirtyState,
            gameStartAction({
                sudokuString: StartedSudokuString,
                difficulty: DifficultyEnum.Hard,
                maxMistakes: 0,
                isChallengeRun: false
            })
        );

        expect(nextState).toMatchObject({
            ...initialGameState,
            historyByDifficulty,
            sudokuString: StartedSudokuString,
            difficulty: DifficultyEnum.Hard,
            maxMistakes: 0
        });
        expect(nextState.hasNewPersonalBestScore).toBe(false);
    });

    it.each([
        { difficulty: DifficultyEnum.Easy, isChallengeRun: false, maxMistakes: 3 },
        { difficulty: DifficultyEnum.Hard, isChallengeRun: false, maxMistakes: 0 },
        { difficulty: DifficultyEnum.Nightmare, isChallengeRun: false, maxMistakes: 99 },
        { difficulty: DifficultyEnum.Nightmare, isChallengeRun: true, maxMistakes: 0 }
    ])('keeps $difficulty with $maxMistakes mistakes and challenge $isChallengeRun while resetting per-attempt state', setup => {
        const completedState = {
            ...initialGameState,
            candidates: { '1-1': [1, 2] },
            challengeState: 'rival-payload',
            challengeTime: 120,
            challengeTimelineEvents: [{ kind: TimelineEventKindEnum.Away as const, ts: 1 }],
            difficulty: DifficultyEnum.Newbie,
            elapsedTime: InitialElapsedTime,
            hasNewPersonalBestScore: true,
            isChallengeRun: !setup.isChallengeRun,
            maxMistakes: 1,
            mistakes: 5,
            score: 4200,
            timelineEvents: [{ kind: TimelineEventKindEnum.Away as const, ts: 2 }],
            wallClockStartMs: 1234
        };

        const nextState = gameSlice.reducer(completedState, gameStartAction({ ...setup, sudokuString: StartedSudokuString }));

        expect(nextState).toMatchObject({ ...setup, sudokuString: StartedSudokuString });
        expect(nextState).toMatchObject({
            candidates: {},
            challengeState: '',
            challengeTime: 0,
            challengeTimelineEvents: [],
            elapsedTime: 0,
            hasNewPersonalBestScore: false,
            mistakes: 0,
            score: 0,
            timelineEvents: [],
            wallClockStartMs: 0
        });
    });

    it('loads partial game state, records mistakes, and resets active progress', () => {
        const historyByDifficulty = {
            ...initialGameState.historyByDifficulty,
            [DifficultyEnum.Newbie]: {
                ...initialGameState.historyByDifficulty[DifficultyEnum.Newbie],
                gamesWon: 1
            }
        };
        const loadedState = gameSlice.reducer(
            { ...initialGameState, historyByDifficulty },
            gameLoadAction({ elapsedTime: InitialElapsedTime, hasNewPersonalBestScore: true, sudokuString: StartedSudokuString })
        );
        const mistakenState = gameSlice.reducer(loadedState, gameMistakeAction({ x: 0, y: 0, value: 5, group: 0 }));
        const resetState = gameSlice.reducer(mistakenState, gameResetAction());

        expect(loadedState.elapsedTime).toBe(InitialElapsedTime);
        expect(loadedState.sudokuString).toBe(StartedSudokuString);
        expect(mistakenState.mistakes).toBe(1);
        expect(resetState).toMatchObject({ ...initialGameState, historyByDifficulty });
        expect(resetState.hasNewPersonalBestScore).toBe(false);
    });

    it('keeps candidate and input modes mutually exclusive', () => {
        const autoCandidateState = gameSlice.reducer(initialGameState, gameToggleAutoCandidatesAction());
        const candidateInputState = gameSlice.reducer(autoCandidateState, gameToggleInputModeAction());
        const normalInputState = gameSlice.reducer(candidateInputState, gameToggleInputModeAction());
        const manualCandidateState = {
            ...initialGameState,
            showAutoCandidates: true
        };
        const disabledAutoCandidateState = gameSlice.reducer(manualCandidateState, gameToggleAutoCandidatesAction());

        expect(autoCandidateState).toMatchObject({ showAutoCandidates: true, inputMode: 'normal' });
        expect(candidateInputState).toMatchObject({ showAutoCandidates: false, inputMode: 'candidate' });
        expect(normalInputState).toMatchObject({ showAutoCandidates: false, inputMode: 'normal' });
        expect(disabledAutoCandidateState).toMatchObject({ showAutoCandidates: false, inputMode: 'normal' });
    });

    it('toggles pencil mark candidates per cell', () => {
        const cell = { x: 2, y: 3, value: 5, group: 1 };
        const cellKey = getCellKey(cell);
        const addedCandidateState = gameSlice.reducer(initialGameState, gameToggleCellCandidateAction(cell));
        const removedCandidateState = gameSlice.reducer(addedCandidateState, gameToggleCellCandidateAction(cell));

        expect(addedCandidateState.candidates[cellKey]).toEqual([cell.value]);
        expect(removedCandidateState.candidates[cellKey]).toEqual([]);
    });

    it('saves a correct cell and cleans stale candidates', () => {
        const sudoku = new Sudoku();
        sudoku.create(DifficultyEnum.Easy);

        const blankCell = sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));

        if (!isDefined(blankCell)) {
            throw new Error('Expected generated puzzle to contain a blank cell');
        }

        const correctCell = { ...blankCell, value: sudoku.getCorrectValue(blankCell) };
        const scoredCells = sudoku.setCellValue(correctCell);
        const correctCellKey = getCellKey(correctCell);
        const affectedBlankCell = sudoku.Field.flat().find(
            cell => sudoku.isBlankCell(cell) && (cell.x === correctCell.x || cell.y === correctCell.y || cell.group === correctCell.group)
        );

        if (!isDefined(affectedBlankCell)) {
            throw new Error('Expected generated puzzle to contain an affected blank peer cell');
        }

        const possibleCandidates = sudoku.getCellCandidates(affectedBlankCell);
        const staleCandidate = Array.from({ length: 9 }, (_, index) => index + 1).find(
            candidate => !possibleCandidates.includes(candidate)
        );

        if (!isDefined(staleCandidate)) {
            throw new Error('Expected affected blank peer cell to reject at least one candidate');
        }

        const affectedCellKey = getCellKey(affectedBlankCell);
        const state = {
            ...initialGameState,
            sudokuString: StartedSudokuString,
            elapsedTime: 1,
            candidates: {
                [correctCellKey]: [correctCell.value],
                [affectedCellKey]: [staleCandidate]
            }
        };

        const savedState = gameSlice.reducer(
            state,
            gameSaveAction({ sudoku, correctCell, scoredCells: { ...emptyScoredCells, ...scoredCells, values: [correctCell.value] } })
        );

        expect(savedState.sudokuString).toBe(sudoku.toString());
        expect(savedState.score).toBeGreaterThan(0);
        expect(savedState.timelineEvents).toEqual([
            { kind: TimelineEventKindEnum.Cell, cellIndex: correctCell.y * 9 + correctCell.x, value: correctCell.value, ts: 1 }
        ]);
        expect(savedState.candidates[correctCellKey]).toEqual([]);
        expect(savedState.candidates[affectedCellKey]).toEqual([]);
    });

    it('ticks only while a puzzle exists and the game is not paused', () => {
        const runningState = {
            ...initialGameState,
            elapsedTime: InitialElapsedTime,
            sudokuString: StartedSudokuString
        };
        const emptyState = {
            ...initialGameState,
            elapsedTime: InitialElapsedTime
        };
        const pausedState = gameSlice.reducer(runningState, gamePauseAction());

        expect(gameSlice.reducer(runningState, gameTickAction()).elapsedTime).toBe(InitialElapsedTime + 1);
        expect(gameSlice.reducer(emptyState, gameTickAction()).elapsedTime).toBe(InitialElapsedTime);
        expect(gameSlice.reducer(pausedState, gameTickAction()).elapsedTime).toBe(InitialElapsedTime);
    });

    it('separates timer pause from pause screen presentation', () => {
        const runningState = {
            ...initialGameState,
            elapsedTime: InitialElapsedTime,
            sudokuString: StartedSudokuString
        };

        const visiblePauseState = gameSlice.reducer(runningState, gamePauseAction());
        const silentPauseState = gameSlice.reducer(runningState, gamePauseAction({ shouldShowPauseScreen: false }));

        expect(visiblePauseState.isPaused).toBe(true);
        expect(visiblePauseState.shouldShowPauseScreen).toBe(true);
        expect(visiblePauseState).toMatchObject({ shouldResumeOnFocus: false });
        expect(silentPauseState.isPaused).toBe(true);
        expect(silentPauseState.shouldShowPauseScreen).toBe(false);
        expect(silentPauseState).toMatchObject({ shouldResumeOnFocus: true });
        expect(gameSlice.reducer(silentPauseState, gameResumeAction())).toMatchObject({ shouldResumeOnFocus: false });
    });

    it('refuses to pause an active challenge run', () => {
        const challengeRunningState = {
            ...initialGameState,
            challengeState: 'challenge-state',
            isChallengeRun: true,
            elapsedTime: InitialElapsedTime,
            sudokuString: StartedSudokuString
        };

        const afterPause = gameSlice.reducer(challengeRunningState, gamePauseAction());
        const afterSilentPause = gameSlice.reducer(challengeRunningState, gamePauseAction({ shouldShowPauseScreen: false }));

        expect(afterPause.isPaused).toBe(false);
        expect(afterPause.shouldShowPauseScreen).toBe(false);
        expect(afterSilentPause.isPaused).toBe(false);
        expect(gameSlice.reducer(afterPause, gameTickAction()).elapsedTime).toBe(InitialElapsedTime + 1);
    });

    it('anchors and fast-forwards the challenge clock from wall time', () => {
        const nowMs = 1_000_000_000;
        const unanchoredState = {
            ...initialGameState,
            challengeState: 'challenge-state',
            isChallengeRun: true,
            elapsedTime: InitialElapsedTime,
            sudokuString: StartedSudokuString
        };

        const anchoredState = gameSlice.reducer(unanchoredState, gameChallengeClockSyncAction({ nowMs }));
        expect(anchoredState.wallClockStartMs).toBe(nowMs - InitialElapsedTime * 1000);
        expect(anchoredState.elapsedTime).toBe(InitialElapsedTime);

        const backgroundSeconds = 90;
        const laterMs = nowMs + backgroundSeconds * 1000;
        const fastForwardedState = gameSlice.reducer(anchoredState, gameChallengeClockSyncAction({ nowMs: laterMs }));
        expect(fastForwardedState.elapsedTime).toBe(InitialElapsedTime + backgroundSeconds);

        const rewoundState = gameSlice.reducer(fastForwardedState, gameChallengeClockSyncAction({ nowMs }));
        expect(rewoundState.elapsedTime).toBe(InitialElapsedTime + backgroundSeconds);
    });

    it('ignores challenge clock sync outside challenge runs', () => {
        const ordinaryState = {
            ...initialGameState,
            elapsedTime: InitialElapsedTime,
            sudokuString: StartedSudokuString
        };

        const syncedState = gameSlice.reducer(ordinaryState, gameChallengeClockSyncAction({ nowMs: 1_000_000_000 }));

        expect(syncedState.wallClockStartMs).toBe(0);
        expect(syncedState.elapsedTime).toBe(InitialElapsedTime);
    });

    it('freezes timer updates when the game finishes', () => {
        const finishedState = gameSlice.reducer(
            {
                ...initialGameState,
                elapsedTime: InitialElapsedTime,
                sudokuString: StartedSudokuString
            },
            gameFinishAction({ difficulty: DifficultyEnum.Easy, isWon: false })
        );

        expect(finishedState.isPaused).toBe(true);
        expect(finishedState.shouldShowPauseScreen).toBe(false);
        expect(finishedState).toMatchObject({ shouldResumeOnFocus: false });
        expect(gameSlice.reducer(finishedState, gameTickAction()).elapsedTime).toBe(InitialElapsedTime);
    });

    it('records won games with best score, clean win, and challenge stats', () => {
        const finishedState = gameSlice.reducer(
            {
                ...initialGameState,
                elapsedTime: InitialElapsedTime,
                maxMistakes: 0,
                score: 250,
                sudokuString: StartedSudokuString
            },
            gameFinishAction({ difficulty: DifficultyEnum.Newbie, isWon: true, isChallenge: true })
        );
        const history = finishedState.historyByDifficulty[DifficultyEnum.Newbie];
        const [completedGame] = history.completedGames;

        expect(history).toMatchObject({
            averageTime: InitialElapsedTime,
            bestScore: 250,
            bestTime: InitialElapsedTime,
            challengesWon: 1,
            gamesCompleted: 1,
            gamesWon: 1,
            gamesWonWithoutMistakes: 1,
            hardcoreWon: 1
        });
        expect(completedGame).toMatchObject({
            difficulty: DifficultyEnum.Newbie,
            elapsedTime: InitialElapsedTime,
            maxMistakes: 0,
            mistakes: 0,
            score: 250
        });
        expect(finishedState).toMatchObject({ isPaused: true, shouldResumeOnFocus: false, shouldShowPauseScreen: false });
    });

    it('records ordinary wins without replacing a better score', () => {
        const historyByDifficulty = {
            ...initialGameState.historyByDifficulty,
            [DifficultyEnum.Medium]: {
                ...initialGameState.historyByDifficulty[DifficultyEnum.Medium],
                bestScore: 500,
                bestTime: 10
            }
        };
        const finishedState = gameSlice.reducer(
            {
                ...initialGameState,
                historyByDifficulty,
                elapsedTime: InitialElapsedTime,
                maxMistakes: 3,
                mistakes: 1,
                score: 250,
                sudokuString: StartedSudokuString
            },
            gameFinishAction({ difficulty: DifficultyEnum.Medium, isWon: true })
        );
        const history = finishedState.historyByDifficulty[DifficultyEnum.Medium];

        expect(history).toMatchObject({
            bestScore: 500,
            bestTime: 10,
            challengesWon: 0,
            gamesCompleted: 1,
            gamesWon: 1,
            gamesWonWithoutMistakes: 0,
            hardcoreWon: 0
        });
        expect(history.completedGames).toHaveLength(1);
    });

    it('records a personal-best result only for a strictly higher ordinary win', () => {
        const historyByDifficulty = {
            ...initialGameState.historyByDifficulty,
            [DifficultyEnum.Medium]: {
                ...initialGameState.historyByDifficulty[DifficultyEnum.Medium],
                bestScore: 250
            }
        };
        const newBestState = gameSlice.reducer(
            { ...initialGameState, historyByDifficulty, score: 251, sudokuString: StartedSudokuString },
            gameFinishAction({ difficulty: DifficultyEnum.Medium, isWon: true })
        );
        const tiedBestState = gameSlice.reducer(
            { ...initialGameState, historyByDifficulty, score: 250, sudokuString: StartedSudokuString },
            gameFinishAction({ difficulty: DifficultyEnum.Medium, isWon: true })
        );
        const challengeBestState = gameSlice.reducer(
            {
                ...initialGameState,
                challengeState: 'challenge-state',
                isChallengeRun: true,
                historyByDifficulty,
                score: 251,
                sudokuString: StartedSudokuString
            },
            gameFinishAction({ difficulty: DifficultyEnum.Medium, isWon: true })
        );
        const actionChallengeBestState = gameSlice.reducer(
            { ...initialGameState, historyByDifficulty, score: 251, sudokuString: StartedSudokuString },
            gameFinishAction({ difficulty: DifficultyEnum.Medium, isChallenge: true, isWon: true })
        );

        expect(newBestState).toMatchObject({ hasNewPersonalBestScore: true });
        expect(tiedBestState).toMatchObject({ hasNewPersonalBestScore: false });
        expect(challengeBestState).toMatchObject({ hasNewPersonalBestScore: false });
        expect(actionChallengeBestState).toMatchObject({ hasNewPersonalBestScore: false });
    });

    it('records challenge losses without creating replay history', () => {
        const finishedState = gameSlice.reducer(
            {
                ...initialGameState,
                elapsedTime: InitialElapsedTime,
                mistakes: 3,
                sudokuString: StartedSudokuString
            },
            gameFinishAction({ difficulty: DifficultyEnum.Hard, isWon: false, isChallenge: true })
        );
        const history = finishedState.historyByDifficulty[DifficultyEnum.Hard];

        expect(history).toMatchObject({
            averageTime: InitialElapsedTime,
            challengesLost: 1,
            gamesCompleted: 1,
            gamesLost: 1
        });
        expect(history.completedGames).toEqual([]);
    });
});
