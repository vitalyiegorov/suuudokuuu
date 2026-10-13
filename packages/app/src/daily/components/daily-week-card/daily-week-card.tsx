import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { dailyGetWeekDays } from '../../utils/daily-get-week-days.util';
import { DailyCard } from '../daily-card/daily-card';
import { DailyWeekDay } from '../daily-week-day/daily-week-day';
import { DailyWeekStripSelectors } from '../daily-week-strip/daily-week-strip.selectors';

import { DailyWeekCardSelectors } from './daily-week-card.selectors';
import { DailyWeekCardStyles as styles } from './daily-week-card.styles';

interface Props {
    readonly bestStreak: number;
    readonly completedDayNumbers: readonly number[];
    readonly todayDayNumber: number;
}

export const DailyWeekCard = ({ bestStreak, completedDayNumbers, todayDayNumber }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const bestStreakStyles = [
        styles.bestStreak,
        { borderTopColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.divider), color: theme.colors.text.hint }
    ];
    const bestStreakLine = isPositiveNumber(bestStreak) ? (
        <BlackText style={bestStreakStyles} testID={DailyWeekCardSelectors.BestStreak}>
            {t({ message: plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' }) })}
        </BlackText>
    ) : null;

    return (
        <DailyCard>
            <View style={styles.strip} testID={DailyWeekStripSelectors.Root}>
                {dailyGetWeekDays(todayDayNumber, completedDayNumbers).map(day => (
                    <DailyWeekDay day={day} key={day.dayNumber} />
                ))}
            </View>

            {bestStreakLine}
        </DailyCard>
    );
};
