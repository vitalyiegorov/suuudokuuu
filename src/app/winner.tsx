import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors, Donation, Header, PageHeader, PlayAgainButton, getTimerText } from '../@generic';
import { gameElapsedTimeSelector, gameScoreSelector } from '../game';

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
