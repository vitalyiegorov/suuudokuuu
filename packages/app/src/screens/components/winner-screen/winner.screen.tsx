import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChallengeFriendButton } from '../../../@generic/components/challenge-friend-button/challenge-friend-button';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';

import { WinnerScreenStyles } from './winner-screen.styles';

export const WinnerScreen = () => {
    const { t } = useLingui();

    const [isGameStarted, score, elapsedTime, isChallengeMode] = useResetGame();

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    return (
        <View style={WinnerScreenStyles.container}>
            <Header text={t`Winners-winner, \n chicken dinner!`} />

            <View>
                <BlackText>
                    <Text>{t`You have scored`} </Text>
                    <Text style={WinnerScreenStyles.boldText}>{score}</Text>{' '}
                </BlackText>

                <BlackText>
                    <Text>{t`It took you`}</Text> <Text style={WinnerScreenStyles.boldText}>{getTimerText(elapsedTime)}</Text>
                </BlackText>
            </View>

            <Donation type="winner" />

            <View style={WinnerScreenStyles.buttonsWrapper}>
                {!isChallengeMode && <ChallengeFriendButton />}
                <PlayAgainButton />
            </View>
        </View>
    );
};
