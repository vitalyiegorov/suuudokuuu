import { createSelector } from '@reduxjs/toolkit';

import { isNotEmptyString } from '@rnw-community/shared';

import { historyGetBestRating } from '../../history/utils/history-get-best-rating.util';
import { getTimelineCellSteps } from '../utils/get-timeline-cell-steps.util';

import type { RootState } from '../../@generic/app-root.store';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const gameSelector = (state: RootState) => state.game;

export const gameSudokuStringSelector = createSelector(gameSelector, state => state.sudokuString);
export const gameDifficultySelector = createSelector(gameSelector, state => state.difficulty);
export const gameRatingSelector = createSelector(gameSelector, state => state.rating);
export const gameIsRatingCeilingSelector = createSelector(gameSelector, state => state.isRatingCeiling);
export const gameScoreSelector = createSelector(gameSelector, state => state.score);
export const gameMistakesSelector = createSelector(gameSelector, state => state.mistakes);
export const gameMaxMistakesSelector = createSelector(gameSelector, state => state.maxMistakes);
export const gamePausedSelector = createSelector(gameSelector, state => state.isPaused);
export const gameShouldShowPauseScreenSelector = createSelector(gameSelector, state => state.shouldShowPauseScreen);
export const gameShouldResumeOnFocusSelector = createSelector(gameSelector, state => state.shouldResumeOnFocus);
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
export const gameCompletedGameByIdSelector = (difficulty: DifficultyEnum, completedAt: number) =>
    createSelector(gameSelector, state =>
        state.historyByDifficulty[difficulty].completedGames.find(game => game.completedAt === completedAt)
    );
export const gameIsStartedSelector = createSelector(gameSelector, state => isNotEmptyString(state.sudokuString));
export const gameHasRivalSelector = createSelector(gameSelector, state => isNotEmptyString(state.challengeState));
export const gameIsChallengeRunSelector = createSelector(gameSelector, state => state.isChallengeRun);
export const gameChallengeStepsSelector = createSelector(gameSelector, state => getTimelineCellSteps(state.challengeTimelineEvents));
export const gameChallengeTimelineEventsSelector = createSelector(gameSelector, state => state.challengeTimelineEvents);
export const gameChallengeStateSelector = createSelector(gameSelector, state => state.challengeState);
export const gameChallengeTimeSelector = createSelector(gameSelector, state => state.challengeTime);
export const gameTimelineEventsSelector = createSelector(gameSelector, state => state.timelineEvents);
export const gameSolutionsStepsSelector = createSelector(gameSelector, state => getTimelineCellSteps(state.timelineEvents));
export const gameHasNewPersonalBestScoreSelector = createSelector(gameSelector, state => state.hasNewPersonalBestScore);
export const gameTechniqueUsageCountsSelector = createSelector(gameSelector, state => state.techniqueUsageCounts);
export const gamePlayedDayNumbersSelector = createSelector(gameSelector, state => state.playedDayNumbers);
export const gameCanUndoSelector = createSelector(
    gameSelector,
    state => !state.isChallengeRun && state.maxMistakes > 0 && state.undoStack.length > 0
);
export const gameCanRedoSelector = createSelector(
    gameSelector,
    state => !state.isChallengeRun && state.maxMistakes > 0 && state.redoStack.length > 0
);
export const gameUndoSnapshotSelector = createSelector(gameSelector, state => state.undoStack[state.undoStack.length - 1]);
export const gameRedoSnapshotSelector = createSelector(gameSelector, state => state.redoStack[state.redoStack.length - 1]);
export const gameBestRatingSelector = createSelector(gameHistoryByDifficultySelector, historyByDifficulty =>
    historyGetBestRating(Object.values(historyByDifficulty))
);
