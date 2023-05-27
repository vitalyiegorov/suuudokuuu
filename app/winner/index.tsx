import { formatDuration, intervalToDuration } from 'date-fns';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { Header } from '../../src/@generic/components/header/header';
import { PageHeader } from '../../src/@generic/components/page-header/page-header';
import { PlayAgainButton } from '../../src/@generic/components/play-again-button/play-again-button';
import { gameEndedAtSelector, gameStartedAtSelector, gameScoreSelector } from '../../src/game/store/game.selectors';

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
            <Text style={styles.scoreText}>
                You have scored <Text style={styles.boldText}>{score}</Text> points
            </Text>
            <Text style={styles.timeText}>
                It took you <Text style={styles.boldText}>{durationFormat}</Text>
            </Text>
            <PlayAgainButton />
        </View>
    );
}
