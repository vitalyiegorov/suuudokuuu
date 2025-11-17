import { useLingui } from '@lingui/react/macro';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameElapsedTimeSelector, gameScoreSelector } from '../../../game/store/game.selectors';

import { WinnerScreenStyles } from './winner-screen.styles';

export const WinnerScreen = () => {
    const { t } = useLingui();

    const score = useSelector(gameScoreSelector);
    const elapsedTime = useSelector(gameElapsedTimeSelector);

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

            <PlayAgainButton />
        </View>
    );
};
