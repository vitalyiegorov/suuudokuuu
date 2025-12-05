import { createSelector } from '@reduxjs/toolkit';

import { isNotEmptyString } from '@rnw-community/shared';

import type { RootState } from '../../@generic/app-root.store';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const gameSelector = (state: RootState) => state.game;

export const gameSudokuStringSelector = createSelector(gameSelector, state => state.sudokuString);
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
export const gameMistakesSelector = createSelector(gameSelector, state => state.mistakes);
export const gameMaxMistakesSelector = createSelector(gameSelector, state => state.maxMistakes);
export const gamePausedSelector = createSelector(gameSelector, state => state.isPaused);
export const gameElapsedTimeSelector = createSelector(gameSelector, state => state.elapsedTime);
export const gameShowAutoCandidatesSelector = createSelector(gameSelector, state => state.showAutoCandidates);
export const gameInputModeSelector = createSelector(gameSelector, state => state.inputMode);
export const gameCandidatesSelector = createSelector(gameSelector, state => state.candidates);
export const gameHistoryByDifficultySelector = createSelector(gameSelector, state => state.historyByDifficulty);
export const gameHistoryBestTimeSelector = createSelector(gameSelector, state =>
    Object.values(state.historyByDifficulty).reduce(
        (max, gameHistory) => (gameHistory.bestScore > max[0] ? [gameHistory.bestScore, gameHistory.bestTime] : max),
        [0, 0]
    )
);
export const gameHistoryDifficultySelector = (difficulty: DifficultyEnum) =>
    createSelector(gameSelector, state => state.historyByDifficulty[difficulty]);
export const gameCompletedGamesSelector = (difficulty: DifficultyEnum) =>
    createSelector(gameSelector, state => state.historyByDifficulty[difficulty].completedGames);
export const gameAllCompletedGamesSelector = createSelector(gameSelector, state =>
    Object.values(state.historyByDifficulty).flatMap(history => history.completedGames)
);
export const gameCompletedGameByIdSelector = (difficulty: DifficultyEnum, completedAt: number) =>
    createSelector(
        gameSelector,
        state =>
            state.historyByDifficulty[difficulty].completedGames.find(
                game => game.completedAt === completedAt
            )
    );
export const gameIsStartedSelector = createSelector(gameSelector, state => isNotEmptyString(state.sudokuString));
export const gameIsChallengeModeSelector = createSelector(gameSelector, state => isNotEmptyString(state.challengeState));
export const gameChallengeStepsSelector = createSelector(gameSelector, state => state.challengeSteps);
export const gameChallengeTimeSelector = createSelector(gameSelector, state => state.challengeTime);
export const gameSolutionsStepsSelector = createSelector(gameSelector, state => state.solutionSteps);
