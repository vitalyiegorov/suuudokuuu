import { useLingui } from '@lingui/react/macro';
import { useLocalSearchParams } from 'expo-router';
import { use } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { GameContext } from '../../../game/context/game.context';

import { SharedScreenStyles as styles } from './shared-screen.styles';

export const SharedScreen = () => {
    const stateObject = useLocalSearchParams<Record<string, string>>();

    const { t } = useLingui();

    const { createFromState } = use(GameContext);

    const handleOpenPuzzle = () => {
        createFromState(Object.keys(stateObject)[0]);
    };

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
