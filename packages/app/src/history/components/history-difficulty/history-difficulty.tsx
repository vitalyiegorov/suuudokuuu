import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { gameHistoryDifficultySelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetWinRate } from '../../utils/history-get-win-rate.util';
import { HistoryMetric } from '../history-metric/history-metric';

import { HistoryDifficultyStyles as styles } from './history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onShowGames: (difficulty: DifficultyEnum) => void;
}

export const HistoryDifficulty = ({ difficulty, onShowGames }: Props) => {
    const { theme } = use(ThemeContext);
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

    const winRate = historyGetWinRate(gamesWon, gamesCompleted);
    const bestTimeText = useTimerText(bestTime);
    const averageTimeText = useTimerText(averageTime);
    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.bg, borderColor: theme.colors.candidate.border }];
    const titleStyles = [styles.title, { color: theme.colors.label.main }];
    const subtitleStyles = [styles.subtitle, { color: theme.colors.label.hint }];
    const badgeStyles = [styles.badge, { backgroundColor: theme.colors.black }];
    const badgeTextStyles = [styles.badgeText, { color: theme.colors.label.inverted }];
    const chipStyles = [styles.chip, { borderColor: theme.colors.candidate.border }];
    const chipLabelStyles = [styles.chipLabel, { color: theme.colors.label.hint }];
    const chipValueStyles = [styles.chipValue, { color: theme.colors.label.main }];
    const handlePress = () => {
        onShowGames(difficulty);
    };

    return (
        <Pressable accessibilityRole="button" onPress={handlePress} style={containerStyles}>
            <View style={styles.header}>
                <View style={styles.titleGroup}>
                    <BlackText style={titleStyles}>{getDifficultyText(difficulty)}</BlackText>
                    <BlackText style={subtitleStyles}>
                        <Plural value={gamesCompleted} one="# completed game" other="# completed games" />
                    </BlackText>
                </View>

                <View style={badgeStyles}>
                    <BlackText style={badgeTextStyles}>{winRate}%</BlackText>
                </View>
            </View>

            <View style={styles.metricRow}>
                <HistoryMetric label={t`Best score`} value={String(bestScore)} />
                <HistoryMetric label={t`Best time`} value={bestTimeText} />
                <HistoryMetric label={t`Average`} value={averageTimeText} />
            </View>

            <View style={styles.chipRow}>
                <View style={chipStyles}>
                    <BlackText style={chipLabelStyles}>
                        <Trans>Won</Trans>
                    </BlackText>
                    <BlackText style={chipValueStyles}>{gamesWon}</BlackText>
                </View>
                <View style={chipStyles}>
                    <BlackText style={chipLabelStyles}>
                        <Trans>Lost</Trans>
                    </BlackText>
                    <BlackText style={chipValueStyles}>{gamesLost}</BlackText>
                </View>
                <View style={chipStyles}>
                    <BlackText style={chipLabelStyles}>
                        <Trans>Clean</Trans>
                    </BlackText>
                    <BlackText style={chipValueStyles}>{gamesWonWithoutMistakes}</BlackText>
                </View>
                <View style={chipStyles}>
                    <Text style={chipLabelStyles}>
                        <Trans>Hardcore</Trans>
                    </Text>
                    <Text style={chipValueStyles}>{hardcoreWon}</Text>
                </View>
                <View style={chipStyles}>
                    <BlackText style={chipLabelStyles}>
                        <Trans>Challenges</Trans>
                    </BlackText>
                    <BlackText style={chipValueStyles}>
                        {challengesWon}/{challengesLost}
                    </BlackText>
                </View>
            </View>
        </Pressable>
    );
};
