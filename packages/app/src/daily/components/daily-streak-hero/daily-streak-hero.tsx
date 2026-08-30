import { plural } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyStreakHeroSelectors } from './daily-streak-hero.selectors';
import { DailyStreakHeroStyles as styles } from './daily-streak-hero.styles';

import type { DailyStatusType } from '../../types/daily-status.type';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly bestStreak: number;
    readonly difficulty: DifficultyEnum;
    readonly status: DailyStatusType;
    readonly streak: number;
    readonly todayDateString: string;
}

export const DailyStreakHero = ({ bestStreak, difficulty, status, streak, todayDateString }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);

    const difficultyLabel = t(getDifficultyMessage(difficulty));
    const statusTextByStatus: Record<DailyStatusType, string> = {
        available: t`Today's puzzle • ${difficultyLabel}`,
        completed: t`Solved today • ${difficultyLabel}`,
        inProgress: t`In progress • ${difficultyLabel}`
    };
    const statusText = statusTextByStatus[status];
    const todayDateText = i18n.date(todayDateString, { day: 'numeric', month: 'long', weekday: 'long' });
    const streakText = plural(streak, { one: '# day streak', other: '# day streak' });
    const bestStreakText = plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' });

    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const dateStyles = [styles.date, { color: theme.colors.text.primary }];
    const heroNumberStyles = [styles.heroNumber, { color: theme.colors.text.primary }];
    const streakLabelStyles = [styles.streakLabel, { color: theme.colors.text.hint }];
    const statusStyles = [styles.status, { color: theme.colors.text.hint }];
    const bestStreakStyles = [styles.bestStreak, { color: theme.colors.text.hint }];

    return (
        <AppSurfaceCard size="compact" testID={DailyStreakHeroSelectors.Root}>
            <View style={styles.header}>
                <BlackText style={eyebrowStyles}>
                    <Trans>Today</Trans>
                </BlackText>

                <BlackText style={statusStyles} testID={DailyStreakHeroSelectors.Status}>
                    {statusText}
                </BlackText>
            </View>

            <BlackText style={dateStyles}>{todayDateText}</BlackText>

            <BlackText style={heroNumberStyles} testID={DailyStreakHeroSelectors.Streak}>
                {streak}
            </BlackText>

            <BlackText style={streakLabelStyles}>{streakText}</BlackText>

            {isPositiveNumber(bestStreak) ? (
                <BlackText style={bestStreakStyles} testID={DailyStreakHeroSelectors.BestStreak}>
                    {bestStreakText}
                </BlackText>
            ) : null}
        </AppSurfaceCard>
    );
};
