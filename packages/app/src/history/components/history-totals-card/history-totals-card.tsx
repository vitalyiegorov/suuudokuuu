import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { historyGetTotals } from '../../utils/history-get-totals.util';

import { HistoryTotalsCardStyles as styles } from './history-totals-card.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

const PrimaryMetricCount = 3;

interface Props {
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    readonly playedDayNumbers: readonly number[];
}

export const HistoryTotalsCard = ({ historyByDifficulty, playedDayNumbers }: Props) => {
    const { t } = useLingui();
    const totals = historyGetTotals(historyByDifficulty, playedDayNumbers);
    const bestTimeText = useTimerText(totals.bestTime);
    const winRateText = `${totals.winRate}%`;

    const metrics = [
        { label: t`Played`, value: String(totals.gamesCompleted) },
        { label: t`Win rate`, value: winRateText },
        { label: t`Streak`, value: String(totals.dayStreak) },
        { label: t`Best score`, value: String(totals.bestScore) },
        { label: t`Best time`, value: bestTimeText }
    ];

    const renderMetricItem = (metric: { label: string; value: string }) => (
        <AppMetricStripItem
            key={metric.label}
            label={metric.label}
            labelStyle={styles.label}
            style={styles.item}
            value={metric.value}
            valueStyle={styles.value}
        />
    );

    return (
        <View style={styles.container}>
            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                {metrics.slice(0, PrimaryMetricCount).map(renderMetricItem)}
            </AppMetricStrip>

            <View style={styles.secondaryRow}>
                <AppMetricStrip separatorStyle={styles.separator} style={styles.secondaryStrip} variant="ghost">
                    {metrics.slice(PrimaryMetricCount).map(renderMetricItem)}
                </AppMetricStrip>

                <View style={styles.spacer} />
            </View>
        </View>
    );
};
