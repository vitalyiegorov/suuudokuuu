import { useLingui } from '@lingui/react/macro';
import LucideCheck from 'lucide-react-native/icons/check';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { dailyGetDateText } from '../../utils/daily-get-date-text.util';
import { DailyDifficultyBars } from '../daily-difficulty-bars/daily-difficulty-bars';
import { DailyRecentSolveResult } from '../daily-recent-solve-result/daily-recent-solve-result';

import { DailyRecentSolveRowSelectors } from './daily-recent-solve-row.selectors';
import { DailyRecentSolveRowStyles as styles } from './daily-recent-solve-row.styles';

import type { DailyCompletedDayInterface } from '../../utils/daily-get-completed-days.util';

const CheckIconSize = 13;
const CheckStrokeWidth = 3;

interface Props {
    readonly day: DailyCompletedDayInterface;
    readonly hasTopDivider: boolean;
    readonly language: string;
}

export const DailyRecentSolveRow = ({ day, hasTopDivider, language }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { hint, primary } = theme.colors.text;
    const dividerStyles = [styles.divider, { backgroundColor: applyColorAlpha(primary, DailyTintAlpha.divider) }];
    const checkBadgeStyles = [styles.checkBadge, { backgroundColor: applyColorAlpha(primary, DailyTintAlpha.badge) }];
    const dateStyles = [styles.date, { color: primary }];
    const difficultyTextStyles = [styles.difficultyText, { color: hint }];

    return (
        <View style={styles.row} testID={`${DailyRecentSolveRowSelectors.Root}.${day.dayNumber}`}>
            {hasTopDivider ? <View style={dividerStyles} /> : null}

            <View style={checkBadgeStyles}>
                <LucideCheck color={primary} size={CheckIconSize} strokeWidth={CheckStrokeWidth} />
            </View>

            <View style={styles.details}>
                <BlackText numberOfLines={1} style={dateStyles}>
                    {dailyGetDateText(day.dayNumber, language)}
                </BlackText>

                <View style={styles.difficulty}>
                    <DailyDifficultyBars color={applyColorAlpha(primary, DailyTintAlpha.secondaryText)} difficulty={day.difficulty} />

                    <BlackText style={difficultyTextStyles}>{t(getDifficultyMessage(day.difficulty))}</BlackText>
                </View>
            </View>

            {isDefined(day.result) ? <DailyRecentSolveResult result={day.result} /> : null}
        </View>
    );
};
