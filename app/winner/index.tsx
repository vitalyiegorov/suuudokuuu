import { formatDuration, intervalToDuration } from 'date-fns';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Donation, Header, PageHeader, PlayAgainButton } from '../../src/@generic';
import { gameEndedAtSelector, gameScoreSelector, gameStartedAtSelector } from '../../src/game';

import { WinnerStyles as styles } from './winner.styles';

const title = 'Winner-winner, \n chicken dinner!';

export default function Winner() {
    const score = useSelector(gameScoreSelector);
    const start = useSelector(gameStartedAtSelector);
    const end = useSelector(gameEndedAtSelector);

    const duration = intervalToDuration({ start, end });
    const durationFormat = formatDuration(duration);

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

            <Donation isWinner />

            <PlayAgainButton />
        </View>
    );
}
