import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';

import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

interface ChallengeResultScreenProps {
    readonly icon: LucideIcon;
    readonly headerText: string;
    readonly differenceLabel: string;
    readonly isWon: boolean;
    readonly extraContent?: ReactNode;
}

export const ChallengeResultScreen = ({ icon: Icon, headerText, differenceLabel, isWon, extraContent }: ChallengeResultScreenProps) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const [isGameStarted, { score, elapsedTime, opponentTotalTime }] = useResetGame();

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const timeDifference = isWon ? opponentTotalTime - elapsedTime : elapsedTime - opponentTotalTime;
    const differenceColor = isWon ? theme.colors.black : theme.colors.red;
    const iconColor = isWon ? theme.colors.black : theme.colors.red;
    const differenceTimeTextStyle = [styles.boldText, { color: differenceColor }];
    const donationType = isWon ? 'winner' : 'loser';

    return (
        <View style={styles.container}>
            <Icon color={iconColor} size={64} style={styles.icon} />

            <Header text={headerText} />

            <View style={styles.statsContainer}>
                <BlackText>
                    <Text>{t`Your time:`} </Text>
                    <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                </BlackText>

                <BlackText>
                    <Text>{t`Opponent's time:`} </Text>
                    <Text style={styles.boldText}>{getTimerText(opponentTotalTime)}</Text>
                </BlackText>

                <BlackText style={styles.differenceText}>
                    <Text>{t`You were`} </Text>
                    <Text style={differenceTimeTextStyle}>{getTimerText(timeDifference)}</Text>
                    <Text> {differenceLabel}</Text>
                </BlackText>

                {isWon && (
                    <BlackText style={styles.messageText}>
                        <Text>{t`Score:`} </Text>
                        <Text style={styles.boldText}>{score}</Text>
                    </BlackText>
                )}

                {extraContent}
            </View>

            <Donation type={donationType} />

            <PlayAgainButton />
        </View>
    );
};
