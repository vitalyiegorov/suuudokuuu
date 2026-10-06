import { getDayStreak } from '@suuudokuuu/progress';
import { getDailyDateString, getDailyDayNumber, getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import * as Clock from 'effect/Clock';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Schedule from 'effect/Schedule';
import { useFocusEffect } from 'expo-router';
import { use, useCallback, useState } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { GameContext } from '../../game/context/game.context';
import { useCurrentRun } from '../../game/query/use-current-run.query';
import { usePlayerStats } from '../../history/query/use-player-stats.query';
import { useSettings } from '../../settings/query/use-settings.query';
import { dailyGetStatus } from '../utils/daily-get-status.util';

import type { DailyStatusType } from '../types/daily-status.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface DailyChallengeInterface {
    readonly bestStreak: number;
    readonly completedDayNumbers: readonly number[];
    readonly difficulty: DifficultyEnum;
    readonly isCreatingGame: boolean;
    readonly isGameStarted: boolean;
    readonly nowMs: number;
    readonly startDaily: () => void;
    readonly status: DailyStatusType;
    readonly streak: number;
    readonly todayDateString: string;
    readonly todayDayNumber: number;
}

export const useDailyChallenge = (): DailyChallengeInterface => {
    const { createDaily, isCreatingGame } = use(GameContext);
    const [nowMs, setNowMs] = useState(() => Date.now());
    const { dailyBestStreak: bestStreak, dailyCompletedDayNumbers: completedDayNumbers } = usePlayerStats();
    const { dailyDayNumber: runDayNumber, sudokuString } = useCurrentRun();
    const maxMistakes = useSettings().lastGameMaxMistakes;
    const isGameStarted = isNotEmptyString(sudokuString);

    useFocusEffect(
        useCallback(() => {
            const clockFiber = appRuntime.runFork(
                Clock.currentTimeMillis.pipe(
                    Effect.flatMap(currentMs => Effect.sync(() => void setNowMs(currentMs))),
                    Effect.repeat(Schedule.spaced(Duration.minutes(1)))
                )
            );

            return () => void clockFiber.interruptUnsafe();
        }, [])
    );

    const todayDateString = getDailyDateString(nowMs);
    const todayDayNumber = getDailyDayNumber(todayDateString);
    const activeRunDayNumber = isGameStarted ? runDayNumber : 0;

    return {
        bestStreak,
        completedDayNumbers,
        difficulty: getDailyDifficulty(todayDateString),
        isCreatingGame,
        isGameStarted,
        nowMs,
        startDaily: () => void createDaily(maxMistakes),
        status: dailyGetStatus(todayDayNumber, completedDayNumbers, activeRunDayNumber),
        streak: getDayStreak(completedDayNumbers, todayDayNumber),
        todayDateString,
        todayDayNumber
    };
};
