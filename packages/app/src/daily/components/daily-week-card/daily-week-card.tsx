import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyCard } from '../daily-card/daily-card';
import { DailyWeekStrip } from '../daily-week-strip/daily-week-strip';

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
            <DailyWeekStrip completedDayNumbers={completedDayNumbers} todayDayNumber={todayDayNumber} />

            {bestStreakLine}
        </DailyCard>
    );
};
