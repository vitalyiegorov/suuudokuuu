import { Plural, useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { useRouter } from 'expo-router';
import { LucideChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryDifficultyChevronSize } from '../../constants/history-difficulty-chevron-size.constant';
import { HistoryMissingValueText } from '../../constants/history-missing-value-text.constant';
import { historyGetWinRate } from '../../utils/history-get-win-rate.util';
import { HistoryMetric } from '../history-metric/history-metric';

import { HistoryDifficultySelectors } from './history-difficulty.selectors';
import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficulty = ({ difficulty }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const router = useRouter();
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

    const difficultyText = getDifficultyText(difficulty);
    const hasWins = gamesWon > 0;
    const hasHardcoreWins = hardcoreWon > 0;
    const hasChallenges = challengesWon + challengesLost > 0;
    const winRateText = `${historyGetWinRate(gamesWon, gamesCompleted)}%`;
    const bestScoreText = hasWins ? String(bestScore) : HistoryMissingValueText;
    const bestTimeValueText = hasWins ? bestTimeText : HistoryMissingValueText;
    const challengesText = `${challengesWon}/${challengesLost}`;

    const containerStyles = [styles.container, { borderColor: theme.colors.surface.border }];
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.text.hint }];

    const handlePress = () => {
        router.push({ params: { difficulty }, pathname: '/history/[difficulty]' });
    };

    return (
        <Pressable
            accessibilityHint={t`Opens the completed games for this difficulty`}
            accessibilityRole="button"
            onPress={handlePress}
            style={containerStyles}
            testID={`${HistoryDifficultySelectors.Card}.${difficulty}`}
        >
            <View style={styles.header}>
                <View style={styles.titleGroup}>
                    <BlackText style={titleStyles}>{difficultyText}</BlackText>
                    <BlackText style={subtitleStyles}>
                        <Plural value={gamesCompleted} one="# completed game" other="# completed games" />
                    </BlackText>
                </View>

                <LucideChevronRight color={theme.colors.text.hint} size={HistoryDifficultyChevronSize} />
            </View>

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
                {hasHardcoreWins ? <HistoryMetric label={t`Hardcore`} value={String(hardcoreWon)} /> : null}
                {hasChallenges ? <HistoryMetric label={t`Challenges`} value={challengesText} /> : null}
            </AppMetricStrip>
        </Pressable>
    );
};
