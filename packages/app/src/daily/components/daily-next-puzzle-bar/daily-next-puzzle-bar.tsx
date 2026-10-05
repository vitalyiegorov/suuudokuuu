import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import LucideClock from 'lucide-react-native/icons/clock';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { MillisecondsPerSecond, SecondsPerDay, SecondsPerHour, SecondsPerMinute } from '../../../@generic/constants/time.constant';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { dailyGetDateString } from '../../utils/daily-get-date-string.util';
import { DailyDifficultyBars } from '../daily-difficulty-bars/daily-difficulty-bars';

import { DailyNextPuzzleBarSelectors } from './daily-next-puzzle-bar.selectors';
import { DailyNextPuzzleBarStyles as styles } from './daily-next-puzzle-bar.styles';

import type { ReactNode } from 'react';

const ClockIconSize = 18;

interface Props {
    readonly children: ReactNode;
    readonly nowMs: number;
    readonly todayDayNumber: number;
}

export const DailyNextPuzzleBar = ({ children, nowMs, todayDayNumber }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { hint, primary } = theme.colors.text;
    const tomorrowDifficulty = getDailyDifficulty(dailyGetDateString(todayDayNumber + 1));
    const secondsUntilTomorrow = Math.max(0, (todayDayNumber + 1) * SecondsPerDay - Math.floor(nowMs / MillisecondsPerSecond));
    const hours = Math.floor(secondsUntilTomorrow / SecondsPerHour);
    const minutes = Math.floor((secondsUntilTomorrow % SecondsPerHour) / SecondsPerMinute);
    const hoursText = plural(hours, { one: '# hr', other: '# hr' });
    const minutesText = plural(minutes, { one: '# min', other: '# min' });
    const rootStyles = [
        styles.root,
        { backgroundColor: applyColorAlpha(primary, DailyTintAlpha.divider), borderColor: applyColorAlpha(primary, DailyTintAlpha.outline) }
    ];
    const countdownStyles = [styles.countdown, { color: primary }];
    const tomorrowTextStyles = [styles.tomorrowText, { color: hint }];

    return (
        <View style={rootStyles} testID={DailyNextPuzzleBarSelectors.Root}>
            <LucideClock color={applyColorAlpha(primary, DailyTintAlpha.secondaryText)} size={ClockIconSize} />

            <View style={styles.texts}>
                <BlackText numberOfLines={1} style={countdownStyles} testID={DailyNextPuzzleBarSelectors.Countdown}>
                    {t`New puzzle in ${hoursText} ${minutesText}`}
                </BlackText>

                <View style={styles.tomorrow}>
                    <BlackText style={tomorrowTextStyles}>{t`Tomorrow:`}</BlackText>

                    <DailyDifficultyBars color={hint} difficulty={tomorrowDifficulty} />

                    <BlackText style={tomorrowTextStyles}>{t(getDifficultyMessage(tomorrowDifficulty))}</BlackText>
                </View>
            </View>

            {children}
        </View>
    );
};
