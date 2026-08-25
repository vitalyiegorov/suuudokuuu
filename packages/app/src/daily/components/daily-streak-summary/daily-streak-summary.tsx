import { plural } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyStreakSummarySelectors } from './daily-streak-summary.selectors';
import { DailyStreakSummaryStyles as styles } from './daily-streak-summary.styles';

interface Props {
    readonly bestStreak: number;
    readonly streak: number;
}

export const DailyStreakSummary = ({ bestStreak, streak }: Props) => {
    const { theme } = use(ThemeContext);

    const labelStyles = [styles.label, { color: theme.colors.text.hint }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];
    const streakText = plural(streak, { one: '# day streak', other: '# day streak' });
    const bestStreakText = plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' });

    return (
        <AppSurfaceCard size="compact" testID={DailyStreakSummarySelectors.Root}>
            <View style={styles.content}>
                <BlackText style={labelStyles}>
                    <Trans>Daily challenge</Trans>
                </BlackText>

                <BlackText style={valueStyles} testID={DailyStreakSummarySelectors.Streak}>
                    {streakText}
                </BlackText>

                <BlackText style={labelStyles} testID={DailyStreakSummarySelectors.BestStreak}>
                    {bestStreakText}
                </BlackText>
            </View>
        </AppSurfaceCard>
    );
};
