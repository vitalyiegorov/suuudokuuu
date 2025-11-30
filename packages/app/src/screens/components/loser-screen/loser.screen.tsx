import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useResetGame } from '../../../@generic/hooks/use-reset-game.hook';

import { LoserScreenStyles } from './loser-screen.styles';

export const LoserScreen = () => {
    const { t } = useLingui();

    const [isGameStarted, { elapsedTime }] = useResetGame();

    if (!isGameStarted && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    return (
        <View style={LoserScreenStyles.container}>
            <Header text={t`Better luck next time!\nLoooooser =)`} />

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
};
