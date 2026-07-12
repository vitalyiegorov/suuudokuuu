import { Trans, useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
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

import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly isWon: boolean;
    readonly children?: ReactNode;
    readonly gameState: GameState;
}

export const ChallengeResultScreen = (props: Props) => {
    const { isWon, children, gameState } = props;
    const { score, elapsedTime, challengeTime, sudokuString } = gameState;

    const { t } = useLingui();
    const { sizeClass } = useAppLayout();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const challengeTimeText = useTimerText(challengeTime);
    const timeDifference = Math.abs(challengeTime - elapsedTime);
    const timeDifferenceText = useTimerText(timeDifference);

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
        <View style={styles.container(sizeClass)}>
            <View style={styles.summaryColumn(sizeClass)}>
                <Icon color={iconColor} size={64} style={styles.icon} />

                <Header text={headerText} />

                {isWon && (
                    <View style={styles.statsContainer}>
                        <BlackText>
                            <Text>
                                <Trans>Your time:</Trans>{' '}
                            </Text>
                            <Text style={styles.boldText}>{elapsedTimeText}</Text>
                        </BlackText>

                        <BlackText>
                            <Text>
                                <Trans>Opponent&apos;s time:</Trans>{' '}
                            </Text>
                            <Text style={styles.boldText}>{challengeTimeText}</Text>
                        </BlackText>

                        <BlackText style={styles.differenceText}>
                            <Text>
                                <Trans>You were</Trans>{' '}
                            </Text>
                            <Text style={differenceTimeTextStyle}>{timeDifferenceText}</Text>
                            <Text> {differenceLabel}</Text>
                        </BlackText>

                        <BlackText style={styles.messageText}>
                            <Text>
                                <Trans>Score:</Trans>{' '}
                            </Text>
                            <Text style={styles.boldText}>{score}</Text>
                        </BlackText>
                    </View>
                )}
            </View>

            <View style={styles.actionsColumn(sizeClass)}>
                <Donation type={donationType} />

                {children}

                <PlayAgainButton />
            </View>
        </View>
    );
};
