import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

jest.mock('@suuudokuuu/encoder', () => {
    const actual = jest.requireActual<typeof import('@suuudokuuu/encoder')>('@suuudokuuu/encoder');

    return {
        ...actual,
        GameStateSerializer: jest.fn(() => ({
            encodeState: jest.fn(() => '')
        }))
    };
});

import { GameEmptySudokuStringConstant } from '../constant/empty-sudoku-string.constant';

import { gameFinishAction, gameStartAction } from './game.actions';
import { gameSlice } from './game.slice';
import { initialGameState } from './game.state';

import type { GameState } from './game.state';

const TodayDayNumber = 20688;
const startSetup = {
    sudokuString: GameEmptySudokuStringConstant,
    difficulty: DifficultyEnum.Medium,
    maxMistakes: 3,
    isChallengeRun: false,
    rating: 0,
    isRatingCeiling: false
};

const startDaily = (state: GameState, dailyDayNumber: number): GameState =>
    gameSlice.reducer(state, gameStartAction({ ...startSetup, dailyDayNumber }));

const finishRun = (state: GameState, isWon: boolean): GameState =>
    gameSlice.reducer(state, gameFinishAction({ difficulty: DifficultyEnum.Medium, isWon }));

const completeDailyDays = (dayNumbers: readonly number[]): GameState =>
    dayNumbers.reduce<GameState>((state, dayNumber) => finishRun(startDaily(state, dayNumber), true), initialGameState);

describe('game daily challenge state', () => {
    it('records the day a won daily belongs to', () => {
        expect.assertions(2);

        const state = completeDailyDays([TodayDayNumber]);

        expect(state.dailyCompletedDayNumbers).toStrictEqual([TodayDayNumber]);
        expect(state.dailyBestStreak).toBe(1);
    });

    it('never records a daily that was lost', () => {
        expect.assertions(2);

        const state = finishRun(startDaily(initialGameState, TodayDayNumber), false);

        expect(state.dailyCompletedDayNumbers).toStrictEqual([]);
        expect(state.dailyBestStreak).toBe(0);
    });

    it('never records a normal run as a daily', () => {
        expect.assertions(1);

        const state = finishRun(startDaily(initialGameState, 0), true);

        expect(state.dailyCompletedDayNumbers).toStrictEqual([]);
    });

    it('grows the best streak across consecutive days', () => {
        expect.assertions(2);

        const state = completeDailyDays([TodayDayNumber - 2, TodayDayNumber - 1, TodayDayNumber]);

        expect(state.dailyCompletedDayNumbers).toStrictEqual([TodayDayNumber - 2, TodayDayNumber - 1, TodayDayNumber]);
        expect(state.dailyBestStreak).toBe(3);
    });

    it('keeps the best streak after a missed day breaks the current one', () => {
        expect.assertions(1);

        const state = completeDailyDays([TodayDayNumber - 5, TodayDayNumber - 4, TodayDayNumber - 3, TodayDayNumber]);

        expect(state.dailyBestStreak).toBe(3);
    });

    it('carries the daily record through the start of the next game', () => {
        expect.assertions(3);

        const completed = completeDailyDays([TodayDayNumber]);
        const nextGame = startDaily(completed, 0);

        expect(nextGame.dailyCompletedDayNumbers).toStrictEqual([TodayDayNumber]);
        expect(nextGame.dailyBestStreak).toBe(1);
        expect(nextGame.dailyDayNumber).toBe(0);
    });

    it('pins a run to the day it started so a midnight rollover cannot move it', () => {
        expect.assertions(1);

        const startedYesterday = startDaily(initialGameState, TodayDayNumber - 1);

        expect(finishRun(startedYesterday, true).dailyCompletedDayNumbers).toStrictEqual([TodayDayNumber - 1]);
    });
});
