import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { LucideHeartCrack } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeLostScreenStyles as styles } from './challenge-lost-screen.styles';

export const ChallengeLostScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const [isGameStarted, , elapsedTime, , opponentTotalTime] = useResetGame();

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const timeDifference = elapsedTime - opponentTotalTime;
    const differenceTimeTextStyle = [styles.boldText, { color: theme.colors.red }];

    return (
        <View style={styles.container}>
            <LucideHeartCrack color={theme.colors.red} size={64} style={styles.icon} />

            <Header text={t`Challenge lost!`} />

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
                    <Text> {t`slower`}</Text>
                </BlackText>

                <BlackText style={styles.messageText}>{t`Better luck next time!`}</BlackText>
            </View>

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
};
