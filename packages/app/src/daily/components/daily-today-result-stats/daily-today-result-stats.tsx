import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyResultStat } from '../daily-result-stat/daily-result-stat';

import { DailyTodayResultStatsSelectors } from './daily-today-result-stats.selectors';
import { DailyTodayResultStatsStyles as styles } from './daily-today-result-stats.styles';

import type { DailyResultType } from '@suuudokuuu/progress';

interface Props {
    readonly result: DailyResultType;
}

export const DailyTodayResultStats = ({ result }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(result.elapsedTime);

    const dividerStyles = [styles.divider, { backgroundColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.divider) }];

    return (
        <View style={styles.root}>
            <DailyResultStat label={t`Time`} testID={DailyTodayResultStatsSelectors.Time} value={elapsedTimeText} />

            <View style={dividerStyles} />

            <DailyResultStat label={t`Score`} testID={DailyTodayResultStatsSelectors.Score} value={i18n.number(result.score)} />

            <View style={dividerStyles} />

            <DailyResultStat label={t`Mistakes`} testID={DailyTodayResultStatsSelectors.Mistakes} value={String(result.mistakes)} />
        </View>
    );
};
