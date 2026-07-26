import { Trans, useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetTotals } from '../../utils/history-get-totals.util';
import { HistoryMetric } from '../history-metric/history-metric';

import { HistoryTotalsCardStyles as styles } from './history-totals-card.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export const HistoryTotalsCard = ({ historyByDifficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const totals = historyGetTotals(historyByDifficulty);
    const bestTimeText = useTimerText(totals.bestTime);

    const scoreCardStyles = [styles.heroCard, { backgroundColor: theme.colors.value.progress }];
    const scoreLabelStyles = [styles.heroLabel, { color: theme.colors.value.text }];
    const scoreValueStyles = [styles.heroValue, { color: theme.colors.value.text }];
    const timeCardStyles = [styles.heroCard, { backgroundColor: theme.colors.black }];
    const timeLabelStyles = [styles.heroLabel, { color: theme.colors.label.inverted }];
    const timeValueStyles = [styles.heroValue, { color: theme.colors.label.inverted }];

    const winRateText = `${totals.winRate}%`;

    return (
        <View style={styles.container}>
            <View style={styles.heroRow}>
                <View style={scoreCardStyles}>
                    <BlackText style={scoreLabelStyles}>
                        <Trans>Best score</Trans>
                    </BlackText>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.62} numberOfLines={1} style={scoreValueStyles}>
                        {totals.bestScore}
                    </BlackText>
                </View>

                <View style={timeCardStyles}>
                    <BlackText style={timeLabelStyles}>
                        <Trans>Best time</Trans>
                    </BlackText>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.62} numberOfLines={1} style={timeValueStyles}>
                        {bestTimeText}
                    </BlackText>
                </View>
            </View>

            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Played`} value={String(totals.gamesCompleted)} />
                <HistoryMetric label={t`Win rate`} value={winRateText} />
                <HistoryMetric label={t`Day streak`} value={String(totals.dayStreak)} />
            </AppMetricStrip>
        </View>
    );
};
