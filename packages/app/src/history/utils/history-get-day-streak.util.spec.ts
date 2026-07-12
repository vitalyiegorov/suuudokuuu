import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { historyGetDayStreak } from './history-get-day-streak.util';

import type { CompletedGameInterface } from '../interfaces/completed-game.interface';

const TestYear = 2026;
const TestMonth = 5;
const TodayDate = 29;
const YesterdayDate = 28;
const PreviousDayDate = 27;
const StaleDate = 26;
const NoonHour = 12;
const MorningHour = 8;
const EveningHour = 18;

const createCompletedGame = (completedAt: number): CompletedGameInterface => ({
    completedAt,
    difficulty: DifficultyEnum.Easy,
    elapsedTime: 65,
    encodedState: '',
    maxMistakes: 3,
    mistakes: 0,
    score: 2782
});

describe('historyGetDayStreak', () => {
    it('counts consecutive completed days ending today', () => {
        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayGame = createCompletedGame(new Date(TestYear, TestMonth, TodayDate, MorningHour).getTime());
        const yesterdayGame = createCompletedGame(new Date(TestYear, TestMonth, YesterdayDate, EveningHour).getTime());
        const previousDayGame = createCompletedGame(new Date(TestYear, TestMonth, PreviousDayDate, EveningHour).getTime());

        expect(historyGetDayStreak([todayGame, yesterdayGame, previousDayGame], now)).toBe(3);
    });

    it('keeps the streak alive when the latest game was yesterday', () => {
        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const yesterdayGame = createCompletedGame(new Date(TestYear, TestMonth, YesterdayDate, EveningHour).getTime());
        const previousDayGame = createCompletedGame(new Date(TestYear, TestMonth, PreviousDayDate, EveningHour).getTime());

        expect(historyGetDayStreak([yesterdayGame, previousDayGame], now)).toBe(2);
    });

    it('stops counting at the first missed day', () => {
        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const todayGame = createCompletedGame(new Date(TestYear, TestMonth, TodayDate, MorningHour).getTime());
        const previousDayGame = createCompletedGame(new Date(TestYear, TestMonth, PreviousDayDate, EveningHour).getTime());

        expect(historyGetDayStreak([todayGame, previousDayGame], now)).toBe(1);
    });

    it('resets when the latest completed game is older than yesterday', () => {
        const now = new Date(TestYear, TestMonth, TodayDate, NoonHour).getTime();
        const staleGame = createCompletedGame(new Date(TestYear, TestMonth, StaleDate, EveningHour).getTime());

        expect(historyGetDayStreak([staleGame], now)).toBe(0);
    });
});
