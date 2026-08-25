import { plural } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { AppButton, AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { useResumeGame } from '../../../game/hooks/use-resume-game.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { useDailyChallenge } from '../../hooks/use-daily-challenge.hook';

import { DailyChallengeCardSelectors } from './daily-challenge-card.selectors';
import { DailyChallengeCardStyles as styles } from './daily-challenge-card.styles';

import type { DailyStatusType } from '../../types/daily-status.type';

export const DailyChallengeCard = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { bestStreak, difficulty, isCreatingGame, isGameStarted, startDaily, status, streak } = useDailyChallenge();
    const resumeGame = useResumeGame();

    const handleStart = () => {
        if (!isGameStarted) {
            startDaily();

            return;
        }

        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: startDaily }
        ]);
    };

    const handlePress = status === 'inProgress' ? resumeGame : handleStart;

    const difficultyLabel = t(getDifficultyMessage(difficulty));
    const descriptionByStatus: Record<DailyStatusType, string> = {
        available: t`Today's puzzle • ${difficultyLabel}`,
        completed: t`Solved today • ${difficultyLabel}`,
        inProgress: t`In progress • ${difficultyLabel}`
    };
    const actionText = status === 'inProgress' ? t`Continue` : t`Play today`;
    const streakText = plural(streak, { one: '# day streak', other: '# day streak' });
    const bestStreakText = plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' });
    const descriptionStyles = [styles.description, { color: theme.colors.text.hint }];
    const streakStyles = [styles.streak, { color: theme.colors.text.primary }];
    const isCompleted = status === 'completed';
    const hasStreak = isPositiveNumber(streak);
    const hasBestStreak = isPositiveNumber(bestStreak);

    return (
        <AppSurfaceCard size="compact" testID={DailyChallengeCardSelectors.Root}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <BlackText numberOfLines={1} style={styles.title}>
                        <Trans>Daily challenge</Trans>
                    </BlackText>

                    {hasStreak ? (
                        <BlackText numberOfLines={1} style={streakStyles} testID={DailyChallengeCardSelectors.Streak}>
                            {streakText}
                        </BlackText>
                    ) : null}
                </View>

                <BlackText style={descriptionStyles} testID={DailyChallengeCardSelectors.Description}>
                    {descriptionByStatus[status]}
                </BlackText>

                {hasBestStreak ? (
                    <BlackText style={descriptionStyles} testID={DailyChallengeCardSelectors.BestStreak}>
                        {bestStreakText}
                    </BlackText>
                ) : null}

                {isCompleted ? null : (
                    <AppButton
                        isLoading={isCreatingGame}
                        onPress={handlePress}
                        size="compact"
                        style={styles.action}
                        testID={DailyChallengeCardSelectors.Action}
                        text={actionText}
                    />
                )}
            </View>
        </AppSurfaceCard>
    );
};
