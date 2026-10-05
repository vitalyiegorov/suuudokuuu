import { Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyDifficultyBars } from '../daily-difficulty-bars/daily-difficulty-bars';

import { DailyTodaySummarySelectors } from './daily-today-summary.selectors';
import { DailyTodaySummaryStyles as styles } from './daily-today-summary.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly todayDateString: string;
}

export const DailyTodaySummary = ({ difficulty, todayDateString }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);

    const { primary } = theme.colors.text;
    const eyebrowStyles = [styles.eyebrow, { color: applyColorAlpha(theme.colors.accent, 1) }];
    const dateStyles = [styles.date, { color: primary }];
    const chipStyles = [styles.chip, { backgroundColor: applyColorAlpha(primary, DailyTintAlpha.chip) }];
    const chipTextStyles = [styles.chipText, { color: primary }];

    return (
        <View style={styles.root} testID={DailyTodaySummarySelectors.Root}>
            <View style={styles.titles}>
                <BlackText style={eyebrowStyles}>
                    <Trans>Today</Trans>
                </BlackText>

                <BlackText numberOfLines={1} style={dateStyles}>
                    {i18n.date(todayDateString, { day: 'numeric', month: 'long', timeZone: 'UTC', weekday: 'long' })}
                </BlackText>
            </View>

            <View style={chipStyles} testID={DailyTodaySummarySelectors.Difficulty}>
                <DailyDifficultyBars color={primary} difficulty={difficulty} />

                <BlackText style={chipTextStyles}>{t(getDifficultyMessage(difficulty))}</BlackText>
            </View>
        </View>
    );
};
