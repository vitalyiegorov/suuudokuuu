import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { historyGetTotals } from '../../utils/history-get-totals.util';

import { HistoryTotalsCardStyles as styles } from './history-totals-card.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    readonly playedDayNumbers: readonly number[];
}

export const HistoryTotalsCard = ({ historyByDifficulty, playedDayNumbers }: Props) => {
    const { t } = useLingui();
    const totals = historyGetTotals(historyByDifficulty, playedDayNumbers);
    const bestTimeText = useTimerText(totals.bestTime);
    const winRateText = `${totals.winRate}%`;

    return (
        <View style={styles.container}>
            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <AppMetricStripItem
                    label={t`Played`}
                    labelStyle={styles.label}
                    style={styles.item}
                    value={String(totals.gamesCompleted)}
                    valueStyle={styles.value}
                />
                <AppMetricStripItem
                    label={t`Win rate`}
                    labelStyle={styles.label}
                    style={styles.item}
                    value={winRateText}
                    valueStyle={styles.value}
                />
                <AppMetricStripItem
                    label={t`Day streak`}
                    labelStyle={styles.label}
                    style={styles.item}
                    value={String(totals.dayStreak)}
                    valueStyle={styles.value}
                />
                <AppMetricStripItem
                    label={t`Best score`}
                    labelStyle={styles.label}
                    style={styles.item}
                    value={String(totals.bestScore)}
                    valueStyle={styles.value}
                />
                <AppMetricStripItem
                    label={t`Best time`}
                    labelStyle={styles.label}
                    style={styles.item}
                    value={bestTimeText}
                    valueStyle={styles.value}
                />
            </AppMetricStrip>
        </View>
    );
};
