import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';

import { LoserScreenStyles } from './loser-screen.styles';

export const LoserScreen = () => {
    const { t } = useLingui();

    return (
        <View style={LoserScreenStyles.container}>
            <Header text={t`Better luck next time!\nLoooooser =)`} />

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
};
