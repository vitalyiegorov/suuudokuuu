import { formatDuration, intervalToDuration } from 'date-fns';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { Header } from '../../components/header/header';
import { PageHeader } from '../../components/page-header/page-header';
import { PlayAgainButton } from '../../components/play-again-button/play-again-button';
import { appRootGameEndedAtSelector, appRootGameStartedAtSelector, appRootScoreSelector } from '../../store/app-root/app-root.selectors';

import { WinnerStyles as styles } from './winner.styles';

const title = 'Winner-winner, \n chicken dinner!';

export default function Winner() {
    const score = useSelector(appRootScoreSelector);
    const start = useSelector(appRootGameStartedAtSelector);
    const end = useSelector(appRootGameEndedAtSelector);

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
