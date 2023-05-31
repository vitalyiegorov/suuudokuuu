import { formatDistance } from 'date-fns';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Donation, Header, PageHeader, PlayAgainButton } from '../../src/@generic';
import { gameElapsedTimeSelector, gameScoreSelector } from '../../src/game';

import { WinnerStyles as styles } from './winner.styles';

const title = 'Winners-winner, \n chicken dinner!';

export default function Winner() {
    const score = useSelector(gameScoreSelector);
    const elapsed = useSelector(gameElapsedTimeSelector);

    const durationFormat = formatDistance(0, elapsed * 1000, { includeSeconds: true });

    return (
        <View style={styles.container}>
            <PageHeader title={title} />
            <Header text={title} />

            <View>
                <Text style={styles.scoreText}>
                    You have scored <Text style={styles.boldText}>{score}</Text>{' '}
                </Text>

                <Text style={styles.timeText}>
                    It took you <Text style={styles.boldText}>{durationFormat}</Text>
                </Text>
            </View>

            <Donation type="winner" />

            <PlayAgainButton />
        </View>
    );
}
