import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Donation } from '../../../@generic/components/donation/donation';
import { Header } from '../../../@generic/components/header/header';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { gameElapsedTimeSelector, gameScoreSelector } from '../../../game/store/game.selectors';

import { WinnerScreenStyles } from './winner-screen.styles';

export const WinnerScreen = () => {
    const score = useSelector(gameScoreSelector);
    const elapsedTime = useSelector(gameElapsedTimeSelector);

    return (
        <View style={WinnerScreenStyles.container}>
            <Header text={`Winners-winner, \n chicken dinner!`} />

            <View>
                <Text style={WinnerScreenStyles.scoreText}>
                    You have scored <Text style={WinnerScreenStyles.boldText}>{score}</Text>{' '}
                </Text>

                <Text style={WinnerScreenStyles.timeText}>
                    It took you <Text style={WinnerScreenStyles.boldText}>{getTimerText(elapsedTime)}</Text>
                </Text>
            </View>

            <Donation type="winner" />

            <PlayAgainButton />
        </View>
    );
};
