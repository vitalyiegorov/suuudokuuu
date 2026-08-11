import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { HistoryMissingValueText } from '../../constants/history-missing-value-text.constant';
import { historyGetWinRate } from '../../utils/history-get-win-rate.util';
import { HistoryMetric } from '../history-metric/history-metric';

import { HistoryGamesSummaryBandSelectors } from './history-games-summary-band.selectors';
import { HistoryGamesSummaryBandStyles as styles } from './history-games-summary-band.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryGamesSummaryBand = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const {
        bestScore,
        bestTime,
        gamesCompleted,
        gamesWon,
        gamesLost,
        averageTime,
        gamesWonWithoutMistakes,
        hardcoreWon,
        challengesWon,
        challengesLost
    } = useAppSelector(gameHistoryDifficultySelector(difficulty));

    const bestTimeText = useTimerText(bestTime);
    const averageTimeText = useTimerText(averageTime);

    const hasWins = gamesWon > 0;
    const hasHardcoreWins = hardcoreWon > 0;
    const hasChallenges = challengesWon + challengesLost > 0;
    const winRateText = `${historyGetWinRate(gamesWon, gamesCompleted)}%`;
    const bestScoreText = hasWins ? String(bestScore) : HistoryMissingValueText;
    const bestTimeValueText = hasWins ? bestTimeText : HistoryMissingValueText;
    const challengesText = `${challengesWon}/${challengesLost}`;

    const outcomeMetrics = [
        hasHardcoreWins ? <HistoryMetric key="hardcore" label={t`Hardcore`} value={String(hardcoreWon)} /> : null,
        hasChallenges ? <HistoryMetric key="challenges" label={t`Challenges`} value={challengesText} /> : null
    ].filter(isDefined);

    return (
        <View style={styles.container} testID={HistoryGamesSummaryBandSelectors.Root}>
            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Win rate`} value={winRateText} />
                <HistoryMetric label={t`Best score`} value={bestScoreText} />
                <HistoryMetric label={t`Best time`} value={bestTimeValueText} />
                <HistoryMetric label={t`Average`} value={averageTimeText} />
            </AppMetricStrip>

            <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                <HistoryMetric label={t`Won`} value={String(gamesWon)} />
                <HistoryMetric label={t`Lost`} value={String(gamesLost)} />
                <HistoryMetric label={t`Clean`} value={String(gamesWonWithoutMistakes)} />
            </AppMetricStrip>

            {isNotEmptyArray(outcomeMetrics) ? (
                <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
                    {outcomeMetrics}
                </AppMetricStrip>
            ) : null}
        </View>
    );
};
