import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { ChallengeAcceptScreen } from '../../../challenge/components/challenge-accept-screen/challenge-accept-screen';
import { GameContext } from '../../../game/context/game.context';
import { urlToGameState } from '../../../game/store/game.state';

import { SharedScreenStyles as styles } from './shared-screen.styles';

export const SharedScreen = () => {
    const { state: stateString } = useLocalSearchParams<{ state: string }>();

    const { t } = useLingui();
    const { createFromState } = use(GameContext);

    const { isChallengeMode, opponentTotalTime } = urlToGameState(stateString);

    const handleOpenPuzzle = () => {
        createFromState(stateString);
    };

    if (isChallengeMode) {
        return <ChallengeAcceptScreen onAccept={handleOpenPuzzle} opponentTotalTime={opponentTotalTime} />;
    }

    return (
        <View style={styles.container}>
            <Header text={t`Open shared puzzle?`} />

            <View style={styles.buttonsWrapper}>
                <BlackButton onPress={handleOpenPuzzle} text={t`Open puzzle`} />
                <BlackButton href="/" text={t`Cancel`} />
            </View>
        </View>
    );
};
