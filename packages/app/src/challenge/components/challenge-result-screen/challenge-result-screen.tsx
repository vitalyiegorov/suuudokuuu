import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { LucideHeartCrack, LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { GameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';

import type { ReactNode } from 'react';

interface ChallengeResultScreenProps {
    readonly isWon: boolean;
    readonly children?: ReactNode;
    readonly gameState: GameState;
}

export const ChallengeResultScreen = (props: ChallengeResultScreenProps) => {
    const { isWon, children, gameState } = props;
    const { score, elapsedTime, challengeTime, sudokuString } = gameState;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (!isNotEmptyString(sudokuString) && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const headerText = isWon ? t`You won the challenge!` : t`Challenge lost!`;
    const Icon = isWon ? LucideTrophy : LucideHeartCrack;
    const iconColor = isWon ? theme.colors.black : theme.colors.red;
    const donationType = isWon ? 'winner' : 'loser';
    const differenceLabel = isWon ? t`faster!` : t`slower!`;

    const timeDifference = Math.abs(challengeTime - elapsedTime);

    const differenceTimeTextStyle = [styles.boldText, { color: isWon ? theme.colors.black : theme.colors.red }];

    return (
        <View style={styles.container}>
            <Icon color={iconColor} size={64} style={styles.icon} />

            <Header text={headerText} />

            {isWon && (
                <View style={styles.statsContainer}>
                    <BlackText>
                        <Text>{t`Your time:`} </Text>
                        <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                    </BlackText>

                    <BlackText>
                        <Text>{t`Opponent's time:`} </Text>
                        <Text style={styles.boldText}>{getTimerText(challengeTime)}</Text>
                    </BlackText>

                    <BlackText style={styles.differenceText}>
                        <Text>{t`You were`} </Text>
                        <Text style={differenceTimeTextStyle}>{getTimerText(timeDifference)}</Text>
                        <Text> {differenceLabel}</Text>
                    </BlackText>

                    <BlackText style={styles.messageText}>
                        <Text>{t`Score:`} </Text>
                        <Text style={styles.boldText}>{score}</Text>
                    </BlackText>
                </View>
            )}

            <Donation type={donationType} />

            {children}

            <PlayAgainButton />
        </View>
    );
};
