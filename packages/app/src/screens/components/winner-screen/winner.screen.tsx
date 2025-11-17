import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';
import { useSelector } from 'react-redux';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameElapsedTimeSelector, gameScoreSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { WinnerScreenStyles } from './winner-screen.styles';

export const WinnerScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const score = useSelector(gameScoreSelector);
    const elapsedTime = useSelector(gameElapsedTimeSelector);

    const confettiColors = [
        theme.colors.blue,
        theme.colors.red,
        theme.colors.label.main,
        theme.colors.cell.active,
        theme.colors.value.progress
    ];

    return (
        <View style={WinnerScreenStyles.container}>
            <Confetti autoplay count={300} isInfinite={false} colors={confettiColors} />
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
