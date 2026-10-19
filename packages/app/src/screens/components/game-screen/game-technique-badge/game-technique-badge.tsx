import { View } from 'react-native';

import { ChallengeRaceBadge } from '../../../../challenge/components/challenge-race-badge/challenge-race-badge';
import { getTapeTechniqueEvents } from '../../../../challenge/utils/get-tape-technique-events.util';
import { useCurrentRun } from '../../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../../game/query/use-elapsed-time.query';

import { GameTechniqueBadgeStyles as styles } from './game-technique-badge.styles';

const BadgeLookaheadSeconds = 1;

export const GameTechniqueBadge = () => {
    const elapsedTime = useElapsedTime();
    const { timelineEvents } = useCurrentRun();

    const badgeElapsedTime = elapsedTime + BadgeLookaheadSeconds;
    const techniqueEvents = getTapeTechniqueEvents(timelineEvents);

    return (
        <View style={styles.container}>
            <ChallengeRaceBadge elapsedTime={badgeElapsedTime} events={techniqueEvents} />
        </View>
    );
};
