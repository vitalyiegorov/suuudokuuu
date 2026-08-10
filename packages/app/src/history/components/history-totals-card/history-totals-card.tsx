import { Trans, useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { router } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { RatingBadge } from '../../../@generic/components/rating-badge/rating-badge';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getRatingExplainerHref } from '../../../@generic/utils/get-rating-explainer-href.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetTotals } from '../../utils/history-get-totals.util';
import { HistoryMetric } from '../history-metric/history-metric';

import { HistoryTotalsCardStyles as styles } from './history-totals-card.styles';

import type { HistoryGameInterface } from '../../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    readonly playedDayNumbers: readonly number[];
}

export const HistoryTotalsCard = ({ historyByDifficulty, playedDayNumbers }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const totals = historyGetTotals(historyByDifficulty, playedDayNumbers);
    const bestTimeText = useTimerText(totals.bestTime);

    const scoreCardStyles = [styles.heroCard, { backgroundColor: theme.colors.numpad.track }];
    const scoreLabelStyles = [styles.heroLabel, { color: theme.colors.numpad.text }];
    const scoreValueStyles = [styles.heroValue, { color: theme.colors.numpad.text }];
    const timeCardStyles = [styles.heroCard, { backgroundColor: theme.colors.ink }];
    const timeLabelStyles = [styles.heroLabel, { color: theme.colors.inkText }];
    const timeValueStyles = [styles.heroValue, { color: theme.colors.inkText }];
    const ratingCardStyles = [
        styles.ratingCard,
        { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }
    ];
    const ratingLabelStyles = [styles.heroLabel, { color: theme.colors.text.primary }];

    const winRateText = `${totals.winRate}%`;
    const hasHardestSolve = totals.bestRating.rating > 0;

    const handlePressRating = () => {
        router.push(getRatingExplainerHref(totals.bestRating.rating, totals.bestRating.isRatingCeiling));
    };

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

            {hasHardestSolve ? (
                <View style={ratingCardStyles}>
                    <BlackText style={ratingLabelStyles}>
                        <Trans>Hardest solve</Trans>
                    </BlackText>

                    <RatingBadge
                        isCeiling={totals.bestRating.isRatingCeiling}
                        onPress={handlePressRating}
                        rating={totals.bestRating.rating}
                    />
                </View>
            ) : null}

            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Played`} value={String(totals.gamesCompleted)} />
                <HistoryMetric label={t`Win rate`} value={winRateText} />
                <HistoryMetric label={t`Day streak`} value={String(totals.dayStreak)} />
            </AppMetricStrip>
        </View>
    );
};
