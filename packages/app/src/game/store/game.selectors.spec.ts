import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';
import { emptyHistoryRatingSnapshot } from '../../history/interfaces/history-rating-snapshot.interface';

import {
    gameBestRatingSelector,
    gameCandidatesSelector,
    gameChallengeStateSelector,
    gameChallengeStepsSelector,
    gameChallengeTimeSelector,
    gameChallengeTimelineEventsSelector,
    gameCompletedGameByIdSelector,
    gameCompletedGamesSelector,
    gameDifficultySelector,
    gameElapsedTimeSelector,
    gameHasNewPersonalBestScoreSelector,
    gameHasRivalSelector,
    gameHistoryBestTimeSelector,
    gameHistoryByDifficultySelector,
    gameHistoryDifficultySelector,
    gameInputModeSelector,
    gameIsChallengeRunSelector,
    gameIsRatingCeilingSelector,
    gameIsStartedSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gamePausedSelector,
    gamePlayedDayNumbersSelector,
    gameRatingSelector,
    gameScoreSelector,
    gameSelector,
    gameShouldResumeOnFocusSelector,
    gameShouldShowPauseScreenSelector,
    gameShowAutoCandidatesSelector,
    gameSolutionsStepsSelector,
    gameSudokuStringSelector,
    gameTechniqueUsageCountsSelector,
    gameTimelineEventsSelector
} from './game.selectors';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { CompletedGameInterface } from '../../history/interfaces/completed-game.interface';

const completedAt = 42;
const elapsedTime = 90;
const gameRating = 4.2;
const firstPlayedDayNumber = 19827;
const secondPlayedDayNumber = 19828;
const hiddenSingleUsageCount = 3;

const completedGame: CompletedGameInterface = {
    encodedState: 'encoded',
    difficulty: DifficultyEnum.Easy,
    rating: 0,
    isRatingCeiling: false,
    elapsedTime: 60,
    score: 100,
    mistakes: 0,
    maxMistakes: 3,
    completedAt
};

const state: GameState = {
    ...initialGameState,
    sudokuString: '123',
    difficulty: DifficultyEnum.Hard,
    rating: gameRating,
    isRatingCeiling: true,
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
    techniqueUsageCounts: { [SolutionTechniqueEnum.HiddenSingle]: hiddenSingleUsageCount },
    playedDayNumbers: [firstPlayedDayNumber, secondPlayedDayNumber],
    historyByDifficulty: {
        ...initialGameState.historyByDifficulty,
        [DifficultyEnum.Easy]: {
            ...emptyGameHistory,
            difficulty: DifficultyEnum.Easy,
            bestScore: 100,
            bestTime: 60,
            bestRating: { rating: 4.2, isRatingCeiling: false },
            completedGames: [completedGame]
        },
        [DifficultyEnum.Hard]: {
            ...emptyGameHistory,
            difficulty: DifficultyEnum.Hard,
            bestRating: { rating: 8.6, isRatingCeiling: true }
        }
    }
};

describe('game selectors', () => {
    it('projects every plain field from the game slice', () => {
        expect(gameSelector({ game: state } as never)).toBe(state);
        expect(gameSudokuStringSelector.resultFunc(state)).toBe('123');
        expect(gameDifficultySelector.resultFunc(state)).toBe(DifficultyEnum.Hard);
        expect(gameRatingSelector.resultFunc(state)).toBe(gameRating);
        expect(gameIsRatingCeilingSelector.resultFunc(state)).toBe(true);
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
        expect(gameChallengeTimelineEventsSelector.resultFunc(state)).toBe(state.challengeTimelineEvents);
        expect(gameHasNewPersonalBestScoreSelector.resultFunc(state)).toBe(true);
        expect(gameTechniqueUsageCountsSelector.resultFunc(state)).toBe(state.techniqueUsageCounts);
        expect(gamePlayedDayNumbersSelector.resultFunc(state)).toBe(state.playedDayNumbers);
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

    it('finds the highest best rating across every difficulty', () => {
        expect(gameBestRatingSelector.resultFunc(state.historyByDifficulty)).toStrictEqual({ rating: 8.6, isRatingCeiling: true });
        expect(gameBestRatingSelector.resultFunc(initialGameState.historyByDifficulty)).toStrictEqual(emptyHistoryRatingSnapshot);
    });

    it('recomputes the best rating from history alone, so an unrelated tick reuses the cached snapshot', () => {
        const firstResult = gameBestRatingSelector.memoizedResultFunc(state.historyByDifficulty);
        const secondResult = gameBestRatingSelector.memoizedResultFunc(state.historyByDifficulty);

        expect(gameBestRatingSelector.dependencies).toStrictEqual([gameHistoryByDifficultySelector]);
        expect(gameHistoryByDifficultySelector.resultFunc({ ...state, elapsedTime: elapsedTime + 1 })).toBe(state.historyByDifficulty);
        expect(secondResult).toBe(firstResult);
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
