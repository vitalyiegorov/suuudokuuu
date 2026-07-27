import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';

import {
    gameCandidatesSelector,
    gameChallengeStateSelector,
    gameChallengeStepsSelector,
    gameChallengeTimeSelector,
    gameCompletedGameByIdSelector,
    gameCompletedGamesSelector,
    gameElapsedTimeSelector,
    gameHasNewPersonalBestScoreSelector,
    gameHasRivalSelector,
    gameHistoryBestTimeSelector,
    gameHistoryByDifficultySelector,
    gameHistoryDifficultySelector,
    gameInputModeSelector,
    gameIsChallengeRunSelector,
    gameIsStartedSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gamePausedSelector,
    gameScoreSelector,
    gameSelector,
    gameShouldResumeOnFocusSelector,
    gameShouldShowPauseScreenSelector,
    gameShowAutoCandidatesSelector,
    gameSolutionsStepsSelector,
    gameSudokuStringSelector,
    gameTimelineEventsSelector
} from './game.selectors';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { CompletedGameInterface } from '../../history/interfaces/completed-game.interface';

const completedAt = 42;
const elapsedTime = 90;

const completedGame: CompletedGameInterface = {
    encodedState: 'encoded',
    difficulty: DifficultyEnum.Easy,
    elapsedTime: 60,
    score: 100,
    mistakes: 0,
    maxMistakes: 3,
    completedAt
};

const state: GameState = {
    ...initialGameState,
    sudokuString: '123',
    score: 7,
    mistakes: 1,
    maxMistakes: 5,
    elapsedTime,
    isPaused: true,
    shouldShowPauseScreen: true,
    shouldResumeOnFocus: true,
    showAutoCandidates: true,
    inputMode: 'candidate',
    candidates: { a1: [1, 2] },
    challengeTime: 30,
    challengeState: 'encoded',
    hasNewPersonalBestScore: true,
    historyByDifficulty: {
        ...initialGameState.historyByDifficulty,
        [DifficultyEnum.Easy]: {
            ...emptyGameHistory,
            difficulty: DifficultyEnum.Easy,
            bestScore: 100,
            bestTime: 60,
            completedGames: [completedGame]
        }
    }
};

describe('game selectors', () => {
    it('projects every plain field from the game slice', () => {
        expect(gameSelector({ game: state } as never)).toBe(state);
        expect(gameSudokuStringSelector.resultFunc(state)).toBe('123');
        expect(gameScoreSelector.resultFunc(state)).toBe(7);
        expect(gameMistakesSelector.resultFunc(state)).toBe(1);
        expect(gameMaxMistakesSelector.resultFunc(state)).toBe(5);
        expect(gamePausedSelector.resultFunc(state)).toBe(true);
        expect(gameShouldShowPauseScreenSelector.resultFunc(state)).toBe(true);
        expect(gameShouldResumeOnFocusSelector.resultFunc(state)).toBe(true);
        expect(gameElapsedTimeSelector.resultFunc(state)).toBe(elapsedTime);
        expect(gameShowAutoCandidatesSelector.resultFunc(state)).toBe(true);
        expect(gameInputModeSelector.resultFunc(state)).toBe('candidate');
        expect(gameCandidatesSelector.resultFunc(state)).toEqual({ a1: [1, 2] });
        expect(gameHistoryByDifficultySelector.resultFunc(state)).toBe(state.historyByDifficulty);
        expect(gameChallengeStepsSelector.resultFunc(state)).toStrictEqual([]);
        expect(gameChallengeStateSelector.resultFunc(state)).toBe('encoded');
        expect(gameChallengeTimeSelector.resultFunc(state)).toBe(30);
        expect(gameSolutionsStepsSelector.resultFunc(state)).toStrictEqual([]);
        expect(gameTimelineEventsSelector.resultFunc(state)).toBe(state.timelineEvents);
        expect(gameHasNewPersonalBestScoreSelector.resultFunc(state)).toBe(true);
    });

    it('derives game and challenge activity from non-empty strings', () => {
        expect(gameIsStartedSelector.resultFunc(state)).toBe(true);
        expect(gameIsStartedSelector.resultFunc(initialGameState)).toBe(false);
        expect(gameHasRivalSelector.resultFunc(state)).toBe(true);
        expect(gameHasRivalSelector.resultFunc(initialGameState)).toBe(false);
    });

    it('separates a challenge run from the presence of a rival', () => {
        expect(gameIsChallengeRunSelector.resultFunc({ ...initialGameState, isChallengeRun: true })).toBe(true);
        expect(gameIsChallengeRunSelector.resultFunc(initialGameState)).toBe(false);
        expect(gameHasRivalSelector.resultFunc({ ...initialGameState, isChallengeRun: true })).toBe(false);
    });

    it('finds the best score and time across difficulties', () => {
        expect(gameHistoryBestTimeSelector.resultFunc(state)).toEqual([100, 60]);
        expect(gameHistoryBestTimeSelector.resultFunc(initialGameState)).toEqual([0, 0]);
    });

    it('selects per-difficulty history, completed games, and games by id', () => {
        expect(gameHistoryDifficultySelector(DifficultyEnum.Easy).resultFunc(state)).toBe(state.historyByDifficulty[DifficultyEnum.Easy]);
        expect(gameCompletedGamesSelector(DifficultyEnum.Easy).resultFunc(state)).toEqual([completedGame]);
        expect(gameCompletedGameByIdSelector(DifficultyEnum.Easy, completedAt).resultFunc(state)).toBe(
            state.historyByDifficulty[DifficultyEnum.Easy].completedGames[0]
        );
        expect(gameCompletedGameByIdSelector(DifficultyEnum.Easy, 7).resultFunc(state)).toBeUndefined();
    });
});
