import { getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import { useFocusEffect } from 'expo-router';
import { use, useCallback, useState } from 'react';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { getDayStreak } from '../../@generic/utils/get-day-streak.util';
import { GameContext } from '../../game/context/game.context';
import {
    gameDailyBestStreakSelector,
    gameDailyCompletedDayNumbersSelector,
    gameDailyDayNumberSelector,
    gameIsStartedSelector
} from '../../game/store/game.selectors';
import { settingsLastGameMaxMistakesSelector } from '../../settings/store/settings.selectors';
import { dailyGetStatus } from '../utils/daily-get-status.util';

import type { DailyStatusType } from '../types/daily-status.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface DailyChallengeInterface {
    readonly bestStreak: number;
    readonly difficulty: DifficultyEnum;
    readonly isCreatingGame: boolean;
    readonly isGameStarted: boolean;
    readonly startDaily: () => void;
    readonly status: DailyStatusType;
    readonly streak: number;
    readonly todayDateString: string;
}

export const useDailyChallenge = (): DailyChallengeInterface => {
    const { createDaily, isCreatingGame } = use(GameContext);
    const [todayDateString, setTodayDateString] = useState(() => getDailyDateString(Date.now()));
    const completedDayNumbers = useAppSelector(gameDailyCompletedDayNumbersSelector);
    const bestStreak = useAppSelector(gameDailyBestStreakSelector);
    const runDayNumber = useAppSelector(gameDailyDayNumberSelector);
    const isGameStarted = useAppSelector(gameIsStartedSelector);
    const maxMistakes = useAppSelector(settingsLastGameMaxMistakesSelector);

    useFocusEffect(useCallback(() => void setTodayDateString(getDailyDateString(Date.now())), []));

    const todayDayNumber = getDailyDayNumber(todayDateString);
    const activeRunDayNumber = isGameStarted ? runDayNumber : 0;

    return {
        bestStreak,
        difficulty: getDailyDifficulty(todayDateString),
        isCreatingGame,
        isGameStarted,
        startDaily: () => void createDaily(maxMistakes),
        status: dailyGetStatus(todayDayNumber, completedDayNumbers, activeRunDayNumber),
        streak: getDayStreak(completedDayNumbers, todayDayNumber),
        todayDateString
    };
};
