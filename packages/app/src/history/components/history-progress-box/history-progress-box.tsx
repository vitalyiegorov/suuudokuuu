import { Trans, useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { HistoryProgressCellToneEnum } from '../../enums/history-progress-cell-tone.enum';
import { historyGetTotals } from '../../utils/history-get-totals.util';
import { HistoryProgressBoxCell } from '../history-progress-box-cell/history-progress-box-cell';
import { HistorySectionTitle } from '../history-section-title/history-section-title';

import { HistoryProgressBoxStyles as styles } from './history-progress-box.styles';

import type { DifficultyStatsType } from '@suuudokuuu/progress';

interface Props {
    readonly difficultyStats: readonly DifficultyStatsType[];
    readonly playedDayNumbers: readonly number[];
}

export const HistoryProgressBox = ({ difficultyStats, playedDayNumbers }: Props) => {
    const { t } = useLingui();
    const totals = historyGetTotals(difficultyStats, playedDayNumbers);
    const bestTimeText = useTimerText(totals.bestTime);
    const averageTimeText = useTimerText(totals.averageTime);

    const cells = [
        { label: t`Played`, tone: HistoryProgressCellToneEnum.SHADED, value: String(totals.gamesCompleted) },
        { label: t`Win rate`, tone: HistoryProgressCellToneEnum.SELECTED, value: `${totals.winRate}%` },
        { label: t`Play streak`, tone: HistoryProgressCellToneEnum.SHADED, value: String(totals.dayStreak) },
        { label: t`Best score`, tone: HistoryProgressCellToneEnum.PLAIN, value: String(totals.bestScore) },
        { label: t`Best time`, tone: HistoryProgressCellToneEnum.SHADED, value: bestTimeText },
        { label: t`Average`, tone: HistoryProgressCellToneEnum.PLAIN, value: averageTimeText },
        { label: t`Lost`, tone: HistoryProgressCellToneEnum.PLAIN, value: String(totals.gamesLost) },
        { label: t`Clean`, tone: HistoryProgressCellToneEnum.SHADED, value: String(totals.cleanWins) },
        { label: t`Hardcore`, tone: HistoryProgressCellToneEnum.PLAIN, value: String(totals.hardcoreWins) }
    ];

    return (
        <View style={styles.container}>
            <HistorySectionTitle>
                <Trans>Your progress</Trans>
            </HistorySectionTitle>

            <View style={styles.box}>
                {cells.map((cell, index) => (
                    <HistoryProgressBoxCell index={index} key={cell.label} label={cell.label} tone={cell.tone} value={cell.value} />
                ))}
            </View>
        </View>
    );
};
