import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { HistoryMetric } from '../history-metric/history-metric';

import { ReplayPaceMetricsSelectors } from './replay-pace-metrics.selectors';
import { ReplayPaceMetricsStyles as styles } from './replay-pace-metrics.styles';

import type { ReplayPaceStatsInterface } from '../../interfaces/replay-pace-stats.interface';

interface Props {
    readonly paceStats: ReplayPaceStatsInterface;
}

export const ReplayPaceMetrics = ({ paceStats }: Props) => {
    const { t } = useLingui();

    const totalTimeText = useTimerText(paceStats.totalTimeSeconds);
    const averagePlacementText = useTimerText(paceStats.averageSecondsPerPlacement);
    const longestPauseText = useTimerText(paceStats.longestPauseSeconds);
    const awayTimeText = useTimerText(paceStats.awaySeconds);
    const autoCandidatesText = paceStats.autoCandidatesUsed ? t`Yes` : t`No`;

    return (
        <View style={styles.container} testID={ReplayPaceMetricsSelectors.Root}>
            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Total time`} value={totalTimeText} />
                <HistoryMetric label={t`Avg / move`} value={averagePlacementText} />
                <HistoryMetric label={t`Longest pause`} value={longestPauseText} />
                <HistoryMetric label={t`Away time`} value={awayTimeText} />
            </AppMetricStrip>

            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Pencil marks`} value={String(paceStats.pencilCount)} />
                <HistoryMetric label={t`Auto-candidates`} value={autoCandidatesText} />
                <HistoryMetric label={t`Mistakes`} value={String(paceStats.mistakesCount)} />
            </AppMetricStrip>
        </View>
    );
};
