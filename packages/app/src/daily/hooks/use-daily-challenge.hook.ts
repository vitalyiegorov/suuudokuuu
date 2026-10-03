import { getDayStreak } from '@suuudokuuu/progress';
import { getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import { useFocusEffect } from 'expo-router';
import { use, useCallback, useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { GameContext } from '../../game/context/game.context';
import { useCurrentRun } from '../../game/query/use-current-run.query';
import { usePlayerStats } from '../../history/query/use-player-stats.query';
import { useSettings } from '../../settings/query/use-settings.query';
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
    const { dailyBestStreak: bestStreak, dailyCompletedDayNumbers: completedDayNumbers } = usePlayerStats();
    const { dailyDayNumber: runDayNumber, sudokuString } = useCurrentRun();
    const maxMistakes = useSettings().lastGameMaxMistakes;
    const isGameStarted = isNotEmptyString(sudokuString);

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
