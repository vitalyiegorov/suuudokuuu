import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Donation } from '../@generic/components/donation/donation';
import { Header } from '../@generic/components/header/header';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PlayAgainButton } from '../@generic/components/play-again-button/play-again-button';
import { Colors } from '../@generic/styles/theme';
import { getTimerText } from '../@generic/utils/get-timer-text.util';
import { gameElapsedTimeSelector, gameScoreSelector } from '../game/store/game.selectors';

const title = 'Winners-winner, \n chicken dinner!';

const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'bold'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center'
    },
    scoreText: {
        color: Colors.black
    },
    timeText: {
        color: Colors.black
    }
});

export default function WinnerPage() {
    const score = useSelector(gameScoreSelector);
    const elapsedTime = useSelector(gameElapsedTimeSelector);

    return (
        <View style={styles.container}>
            <PageHeader title={title} />
            <Header text={title} />

            <View>
                <Text style={styles.scoreText}>
                    You have scored <Text style={styles.boldText}>{score}</Text>{' '}
                </Text>

                <Text style={styles.timeText}>
                    It took you <Text style={styles.boldText}>{getTimerText(elapsedTime)}</Text>
                </Text>
            </View>

            <Donation type="winner" />

            <PlayAgainButton />
        </View>
    );
}
