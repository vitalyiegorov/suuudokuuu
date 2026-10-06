import { useLingui } from '@lingui/react/macro';
import LucideCheck from 'lucide-react-native/icons/check';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyWeekDayStateEnum } from '../../enums/daily-week-day-state.enum';
import { dailyGetDateString } from '../../utils/daily-get-date-string.util';
import { dailyGetDateText } from '../../utils/daily-get-date-text.util';
import { DailyDifficultyBars } from '../daily-difficulty-bars/daily-difficulty-bars';

import { DailyWeekDaySelectors } from './daily-week-day.selectors';
import { DailyWeekDayStyles as styles } from './daily-week-day.styles';

import type { DailyWeekDayInterface } from '../../interfaces/daily-week-day.interface';
import type { StyleProp, ViewStyle } from 'react-native';

const CheckIconSize = 18;
const CheckStrokeWidth = 3;
const DimmedOpacity = 0.45;

interface Props {
    readonly day: DailyWeekDayInterface;
    readonly language: string;
}

export const DailyWeekDay = ({ day, language }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { hint, primary } = theme.colors.text;
    const accentColor = applyColorAlpha(theme.colors.accent, 1);
    const circleStyleByState: Record<DailyWeekDayStateEnum, StyleProp<ViewStyle>> = {
        [DailyWeekDayStateEnum.SOLVED]: { backgroundColor: theme.colors.ink },
        [DailyWeekDayStateEnum.MISSED]: [styles.missed, { borderColor: applyColorAlpha(primary, DailyTintAlpha.missedBorder) }],
        [DailyWeekDayStateEnum.TODAY]: [styles.today, { borderColor: accentColor }],
        [DailyWeekDayStateEnum.TODAY_SOLVED]: { backgroundColor: accentColor },
        [DailyWeekDayStateEnum.UPCOMING]: [styles.upcoming, { borderColor: applyColorAlpha(primary, DailyTintAlpha.upcomingBorder) }]
    };
    const contentColorByState: Record<DailyWeekDayStateEnum, string> = {
        [DailyWeekDayStateEnum.SOLVED]: theme.colors.inkText,
        [DailyWeekDayStateEnum.MISSED]: hint,
        [DailyWeekDayStateEnum.TODAY]: primary,
        [DailyWeekDayStateEnum.TODAY_SOLVED]: theme.colors.background,
        [DailyWeekDayStateEnum.UPCOMING]: applyColorAlpha(primary, DailyTintAlpha.upcomingText)
    };
    const stateTextByState: Record<DailyWeekDayStateEnum, string> = {
        [DailyWeekDayStateEnum.SOLVED]: t`Solved`,
        [DailyWeekDayStateEnum.MISSED]: t`Not solved`,
        [DailyWeekDayStateEnum.TODAY]: t`Today`,
        [DailyWeekDayStateEnum.TODAY_SOLVED]: t`Solved today`,
        [DailyWeekDayStateEnum.UPCOMING]: t`Upcoming`
    };
    const isToday = day.state === DailyWeekDayStateEnum.TODAY || day.state === DailyWeekDayStateEnum.TODAY_SOLVED;
    const isSolved = day.state === DailyWeekDayStateEnum.SOLVED || day.state === DailyWeekDayStateEnum.TODAY_SOLVED;
    const isDimmed = day.state === DailyWeekDayStateEnum.MISSED || day.state === DailyWeekDayStateEnum.UPCOMING;
    const date = new Date(dailyGetDateString(day.dayNumber));
    const dateText = dailyGetDateText(day.dayNumber, language);
    const stateText = stateTextByState[day.state];
    const contentColor = contentColorByState[day.state];
    const linkColor = applyColorAlpha(theme.colors.accent, DailyTintAlpha.link);
    const haloColor = isToday ? applyColorAlpha(theme.colors.accent, DailyTintAlpha.halo) : 'transparent';
    const weekdayStyles = [styles.weekday, isToday && styles.weekdayToday, { color: isToday ? primary : hint }];
    const haloStyles = [styles.halo, { borderColor: haloColor }];
    const circleStyles = [styles.circle, circleStyleByState[day.state]];
    const dayOfMonthStyles = [styles.dayOfMonth, isToday && styles.dayOfMonthToday, { color: contentColor }];
    const barsStyles = { opacity: isDimmed ? DimmedOpacity : 1 };
    const linkToPreviousStyles = [styles.link, styles.linkToPrevious, { backgroundColor: linkColor }];
    const linkToNextStyles = [styles.link, styles.linkToNext, { backgroundColor: linkColor }];

    return (
        <View
            accessibilityLabel={t`${dateText}, ${stateText}`}
            accessible
            style={styles.column}
            testID={`${DailyWeekDaySelectors.Root}.${day.dayNumber}`}
        >
            {day.isLinkedToPrevious ? <View style={linkToPreviousStyles} /> : null}
            {day.isLinkedToNext ? <View style={linkToNextStyles} /> : null}

            <BlackText style={weekdayStyles}>
                {new Intl.DateTimeFormat(language, { timeZone: 'UTC', weekday: 'short' }).format(date)}
            </BlackText>

            <View style={haloStyles}>
                <View style={circleStyles}>
                    {isSolved ? (
                        <LucideCheck color={contentColor} size={CheckIconSize} strokeWidth={CheckStrokeWidth} />
                    ) : (
                        <BlackText style={dayOfMonthStyles}>{date.getUTCDate()}</BlackText>
                    )}
                </View>
            </View>

            <View style={barsStyles}>
                <DailyDifficultyBars color={applyColorAlpha(primary, DailyTintAlpha.bars)} difficulty={day.difficulty} />
            </View>
        </View>
    );
};
