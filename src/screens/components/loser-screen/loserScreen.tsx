import { View } from 'react-native';

import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';

import { LooserScreenStyles } from './looser-screen.styles';

export const LoserScreen = () => (
    <View style={LooserScreenStyles.container}>
        <Header text={'Better luck next time!\nLoooooser =)'} />

        <Donation type="loser" />

        <PlayAgainButton />
    </View>
);
