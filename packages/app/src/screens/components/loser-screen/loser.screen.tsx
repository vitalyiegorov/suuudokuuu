import { useLingui } from '@lingui/react/macro';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction } from '../../../game/store/game.actions';

import { LoserScreenStyles } from './loser-screen.styles';

export const LoserScreen = () => {
    const { t } = useLingui();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(gameResetAction());
    }, [dispatch]);

    return (
        <View style={LoserScreenStyles.container}>
            <Header text={t`Better luck next time!\nLoooooser =)`} />

            <Donation type="loser" />

            <PlayAgainButton />
        </View>
    );
};
