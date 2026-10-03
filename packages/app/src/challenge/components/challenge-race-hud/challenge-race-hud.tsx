import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';
import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { useChallengeTechniqueEvents } from '../../hooks/use-challenge-technique-events.hook';
import { getChallengeAwayRanges } from '../../utils/get-challenge-away-ranges.util';
import { getChallengeProgress } from '../../utils/get-challenge-progress.util';
import { ChallengeRaceBadge } from '../challenge-race-badge/challenge-race-badge';
import { ChallengeRaceStatus } from '../challenge-race-status/challenge-race-status';
import { ChallengeRaceTimeline } from '../challenge-race-timeline/challenge-race-timeline';

import { ChallengeRaceHudSelectors } from './challenge-race-hud.selectors';
import { ChallengeRaceHudStyles as styles } from './challenge-race-hud.styles';

export const ChallengeRaceHud = () => {
    const elapsedTime = useElapsedTime();
    const { challengeTime, challengeTimelineEvents, timelineEvents } = useCurrentRun();
    const challengeSteps = getTimelineCellSteps(challengeTimelineEvents);
    const playerSteps = getTimelineCellSteps(timelineEvents);

    const events = useChallengeTechniqueEvents();

    const awayRanges = getChallengeAwayRanges(challengeTimelineEvents, challengeTime);
    const [, opponentProgress] = getChallengeProgress(challengeSteps, challengeTime, elapsedTime);
    const playerProgress = challengeSteps.length === 0 ? 0 : playerSteps.length / challengeSteps.length;

    useEffect(() => {
        if (opponentProgress >= 1) {
            void runCurrentRunCommand(currentRunService => currentRunService.finish(false, true));
            router.replace({ pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } });
        }
    }, [opponentProgress]);

    return (
        <View style={styles.container} testID={ChallengeRaceHudSelectors.Root}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <ChallengeRaceStatus opponentProgress={opponentProgress} playerProgress={playerProgress} />
                    <ChallengeRaceBadge elapsedTime={elapsedTime} events={events} />
                </View>
                <ChallengeRaceTimeline
                    awayRanges={awayRanges}
                    events={events}
                    opponentProgress={opponentProgress}
                    playerProgress={playerProgress}
                    totalTime={challengeTime}
                />
            </View>
        </View>
    );
};
