import { Trans, useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { LucidePlay } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { RatingBadge } from '../../../@generic/components/rating-badge/rating-badge';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryMetric } from '../history-metric/history-metric';

import { CompletedGameItemSelectors } from './completed-game-item.selectors';
import { CompletedGameItemStyles as styles } from './completed-game-item.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';

interface Props {
    readonly game: CompletedGameInterface;
}

export const CompletedGameItem = ({ game }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const difficultyStyles = [styles.difficulty, { color: theme.colors.text.primary }];
    const replayButtonStyles = [styles.replayButton, { backgroundColor: theme.colors.ink }];
    const iconColor = theme.colors.inkText;
    const replayTextStyles = [styles.replayText, { color: iconColor }];
    const completedDate = new Date(game.completedAt);
    const completedDateText = completedDate.toLocaleDateString();
    const mistakesValue = game.maxMistakes >= 99 ? String(game.mistakes) : `${game.mistakes}/${game.maxMistakes}`;
    const elapsedTimeText = useTimerText(game.elapsedTime);
    const hasRating = isPositiveNumber(game.rating);

    return (
        <View style={containerStyles}>
            <View style={styles.header}>
                <View style={styles.titleGroup}>
                    <BlackText style={eyebrowStyles}>{completedDateText}</BlackText>
                    <View style={styles.difficultyRow}>
                        <BlackText style={difficultyStyles}>{getDifficultyText(game.difficulty)}</BlackText>
                        {hasRating && <RatingBadge isCeiling={game.isRatingCeiling} rating={game.rating} />}
                    </View>
                </View>

                <AppLinkButton
                    href={`/history/${game.difficulty}/${game.completedAt}`}
                    style={replayButtonStyles}
                    testID={CompletedGameItemSelectors.ReplayButton}
                >
                    <LucidePlay color={iconColor} size={18} fill={iconColor} />
                    <Text style={replayTextStyles}>
                        <Trans>Replay</Trans>
                    </Text>
                </AppLinkButton>
            </View>

            <AppMetricStrip style={styles.metrics} variant="ghost">
                <HistoryMetric label={t`Score`} value={String(game.score)} />
                <HistoryMetric label={t`Time`} value={elapsedTimeText} />
                <HistoryMetric label={t`Mistakes`} value={mistakesValue} />
            </AppMetricStrip>
        </View>
    );
};
