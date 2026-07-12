import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetTotals } from '../../utils/history-get-totals.util';

import { HistoryTotalsCardStyles as styles } from './history-totals-card.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export const HistoryTotalsCard = ({ historyByDifficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const totals = historyGetTotals(historyByDifficulty);
    const bestTimeText = useTimerText(totals.bestTime);

    const containerStyles = [styles.container];
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.label.hint }];
    const scoreCardStyles = [styles.heroCard, { backgroundColor: theme.colors.value.progress }];
    const scoreLabelStyles = [styles.heroLabel, { color: theme.colors.value.text }];
    const scoreValueStyles = [styles.heroValue, { color: theme.colors.value.text }];
    const timeCardStyles = [styles.heroCard, { backgroundColor: theme.colors.black }];
    const timeLabelStyles = [styles.heroLabel, { color: theme.colors.label.inverted }];
    const timeValueStyles = [styles.heroValue, { color: theme.colors.label.inverted }];
    const detailStyles = [styles.detail, { backgroundColor: theme.colors.candidate.bg, borderColor: theme.colors.candidate.border }];
    const detailLabelStyles = [styles.detailLabel, { color: theme.colors.label.hint }];
    const detailValueStyles = [styles.detailValue, { color: theme.colors.label.main }];

    return (
        <View style={containerStyles}>
            <View style={styles.titleGroup}>
                <BlackText style={titleStyles}>
                    <Trans>Stats</Trans>
                </BlackText>
                <BlackText style={subtitleStyles}>
                    <Trans>Your sudoku journey</Trans>
                </BlackText>
            </View>

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

            <View style={styles.detailRow}>
                <View style={detailStyles}>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={detailValueStyles}>
                        {totals.gamesCompleted}
                    </BlackText>
                    <BlackText style={detailLabelStyles}>
                        <Trans>Played</Trans>
                    </BlackText>
                </View>
                <View style={detailStyles}>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={detailValueStyles}>
                        {totals.winRate}%
                    </BlackText>
                    <BlackText style={detailLabelStyles}>
                        <Trans>Win rate</Trans>
                    </BlackText>
                </View>
                <View style={detailStyles}>
                    <BlackText adjustsFontSizeToFit minimumFontScale={0.68} numberOfLines={1} style={detailValueStyles}>
                        {totals.dayStreak}
                    </BlackText>
                    <BlackText style={detailLabelStyles}>
                        <Trans>Day streak</Trans>
                    </BlackText>
                </View>
            </View>
        </View>
    );
};
