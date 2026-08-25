import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { isNotEmptyString, isPositiveNumber } from '@rnw-community/shared';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { getDayStreak } from '../../@generic/utils/get-day-streak.util';
import { maxCompletedGamesPerDifficulty } from '../../history/constants/max-completed-games-per-difficulty.constant';

import { addDayNumber } from './add-day-number.util';
import { gameStateToString } from './game-state-to-string.util';

import type { GameFinishPayloadInterface } from '../interface/game-finish-payload.interface';
import type { GameState } from '../store/game.state';

export const gameFinishRun = (state: GameState, payload: GameFinishPayloadInterface): void => {
    const { difficulty, isWon, isChallenge = false } = payload;
    const history = state.historyByDifficulty[difficulty];
    const hasNewPersonalBestScore = isWon && !isChallenge && !isNotEmptyString(state.challengeState) && state.score > history.bestScore;

    state.hasNewPersonalBestScore = hasNewPersonalBestScore;
    state.playedDayNumbers = addDayNumber(state.playedDayNumbers, getDayNumber(Date.now()));

    history.gamesCompleted += 1;

    if (isWon && isPositiveNumber(state.dailyDayNumber)) {
        state.dailyCompletedDayNumbers = addDayNumber(state.dailyCompletedDayNumbers, state.dailyDayNumber);
        state.dailyBestStreak = Math.max(state.dailyBestStreak, getDayStreak(state.dailyCompletedDayNumbers, state.dailyDayNumber));
    }

    if (isWon) {
        history.averageTime = (history.averageTime * history.gamesWon + state.elapsedTime) / (history.gamesWon + 1);

        if (history.bestTime === 0 || state.elapsedTime < history.bestTime) {
            history.bestTime = state.elapsedTime;
        }

        history.gamesWon += 1;
        history.gamesWonWithoutMistakes += state.mistakes === 0 ? 1 : 0;
        history.hardcoreWon += state.maxMistakes === 0 ? 1 : 0;
        history.challengesWon += isChallenge ? 1 : 0;
        history.completedGames = [
            {
                difficulty,
                rating: state.rating,
                isRatingCeiling: state.isRatingCeiling,
                encodedState: gameStateToString(state, SharedPayloadKindEnum.Handoff),
                elapsedTime: state.elapsedTime,
                score: state.score,
                mistakes: state.mistakes,
                maxMistakes: state.maxMistakes,
                completedAt: Date.now()
            },
            ...history.completedGames
        ].slice(0, maxCompletedGamesPerDifficulty);

        if (state.score > history.bestScore) {
            history.bestScore = state.score;
        }

        if (state.rating > history.bestRating.rating) {
            history.bestRating = { rating: state.rating, isRatingCeiling: state.isRatingCeiling };
        }
    } else {
        history.gamesLost += 1;
        history.challengesLost += isChallenge ? 1 : 0;
    }

    state.isPaused = true;
    state.shouldShowPauseScreen = false;
    state.shouldResumeOnFocus = false;
};
