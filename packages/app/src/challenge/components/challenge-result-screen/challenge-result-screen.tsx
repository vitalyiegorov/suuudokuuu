import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { AppMetricCard } from '@suuudokuuu/ui';
import { Redirect } from 'expo-router';
import { LucideHeartCrack, LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { GameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeResultScreenSelectors } from './challenge-result-screen.selectors';
import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly isWon: boolean;
    readonly children?: ReactNode;
    readonly gameState: GameState;
}

export const ChallengeResultScreen = (props: Props) => {
    const { isWon, children, gameState } = props;
    const { score, elapsedTime, challengeSteps, challengeTime, sudokuString } = gameState;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const challengeTimeText = useTimerText(challengeTime);
    const timeDifference = Math.abs(challengeTime - elapsedTime);
    const timeDifferenceText = useTimerText(timeDifference);
    const opponentAttemptsText = String(challengeSteps.length);
    const scoreText = String(score);

    if (!isNotEmptyString(sudokuString) && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const headerText = isWon ? t`You won the challenge!` : t`Challenge lost!`;
    const Icon = isWon ? LucideTrophy : LucideHeartCrack;
    const iconColor = isWon ? theme.colors.black : theme.colors.red;
    const donationType = isWon ? 'winner' : 'loser';
    const differenceLabel = isWon ? t`faster!` : t`slower!`;

    const differenceTimeTextStyle = [styles.boldText, { color: isWon ? theme.colors.black : theme.colors.red }];

    return (
        <View style={styles.container}>
            <Icon color={iconColor} size={64} style={styles.icon} />

            <Header text={headerText} />

            {isWon && (
                <View style={styles.statsContainer}>
                    <View style={styles.metricsGrid}>
                        <View style={styles.metricsRow}>
                            <AppMetricCard
                                label={t`Your time`}
                                size="compact"
                                testID={ChallengeResultScreenSelectors.YourTimeValue}
                                value={elapsedTimeText}
                                variant="inverted"
                            />
                            <AppMetricCard
                                label={t`Opponent time`}
                                size="compact"
                                testID={ChallengeResultScreenSelectors.OpponentTimeValue}
                                value={challengeTimeText}
                            />
                        </View>

                        <View style={styles.metricsRow}>
                            <AppMetricCard
                                label={t`Opponent attempts`}
                                size="compact"
                                testID={ChallengeResultScreenSelectors.OpponentAttemptsValue}
                                value={opponentAttemptsText}
                            />
                            <AppMetricCard
                                label={t`Score`}
                                size="compact"
                                testID={ChallengeResultScreenSelectors.ScoreValue}
                                value={scoreText}
                            />
                        </View>
                    </View>

                    <BlackText style={styles.differenceText}>
                        <Text>
                            <Trans>You were</Trans>{' '}
                        </Text>
                        <Text style={differenceTimeTextStyle}>{timeDifferenceText}</Text>
                        <Text> {differenceLabel}</Text>
                    </BlackText>

                    <BlackText style={styles.messageText}>
                        <Plural
                            value={challengeSteps.length}
                            one="Opponent solved it in # attempt."
                            other="Opponent solved it in # attempts."
                        />
                    </BlackText>
                </View>
            )}

            <Donation type={donationType} />

            {children}

            <PlayAgainButton />
        </View>
    );
};
