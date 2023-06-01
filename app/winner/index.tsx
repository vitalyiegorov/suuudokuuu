import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Donation, Header, PageHeader, PlayAgainButton, getGameDistance } from '../../src/@generic';
import { gameElapsedTimeSelector, gameScoreSelector } from '../../src/game';

import { WinnerStyles as styles } from './winner.styles';

const title = 'Winners-winner, \n chicken dinner!';

export default function Winner() {
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
                    It took you <Text style={styles.boldText}>{getGameDistance(elapsedTime)}</Text>
                </Text>
            </View>

            <Donation type="winner" />

            <PlayAgainButton />
        </View>
    );
}
