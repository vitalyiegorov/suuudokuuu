import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import * as Fiber from 'effect/Fiber';
import { router } from 'expo-router';
import { use, useEffect } from 'react';
import { View } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { GameContext } from '../../../game/context/game.context';
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { finishGameOnce } from '../../../game/utils/finish-game-once.util';
import { getTimelineCellSteps } from '../../../game/utils/get-timeline-cell-steps.util';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { useChallengeTechniqueEvents } from '../../hooks/use-challenge-technique-events.hook';
import { getChallengeAwayRanges } from '../../utils/get-challenge-away-ranges.util';
import { ChallengeRaceBadge } from '../challenge-race-badge/challenge-race-badge';
import { ChallengeRaceStatus } from '../challenge-race-status/challenge-race-status';
import { ChallengeRaceTimeline } from '../challenge-race-timeline/challenge-race-timeline';

import { ChallengeRaceHudSelectors } from './challenge-race-hud.selectors';
import { ChallengeRaceHudStyles as styles } from './challenge-race-hud.styles';

export const ChallengeRaceHud = () => {
    const { engine } = use(GameContext);
    const elapsedTime = useElapsedTime();
    const { challengeTime, challengeTimelineEvents, timelineEvents } = useCurrentRun();
    const challengeSteps = getTimelineCellSteps(challengeTimelineEvents);
    const playerSteps = getTimelineCellSteps(timelineEvents);

    const events = useChallengeTechniqueEvents();

    const awayRanges = getChallengeAwayRanges(challengeTimelineEvents, challengeTime);
    const { progress: opponentProgress } = challengeTimelineEvents.reduce(
        (position, event) => {
            const cumulativeTime = position.cumulativeTime + event.ts;
            const hasPlacement = challengeTime > 0 && event.kind === TimelineEventKindEnum.Cell && cumulativeTime <= elapsedTime;

            return {
                cumulativeTime,
                progress: hasPlacement ? Math.min(cumulativeTime / challengeTime, 1) : position.progress
            };
        },
        { cumulativeTime: 0, progress: 0 }
    );
    const hasRivalFinished = challengeTime > 0 && elapsedTime >= challengeTime;
    const playerProgress = challengeSteps.length === 0 ? 0 : playerSteps.length / challengeSteps.length;

    useEffect(() => {
        if (!hasRivalFinished) {
            return emptyFn;
        }

        const fiber = appRuntime.runFork(
            finishGameOnce(
                engine,
                Effect.flatMap(CurrentRunService, currentRunService => currentRunService.finish(false, true))
            ).pipe(
                Effect.tap(didFinish =>
                    didFinish
                        ? Effect.sync(
                              () => void router.replace({ pathname: '/challenge-lost', params: { reason: ChallengeLossReason.Time } })
                          )
                        : Effect.void
                ),
                Effect.tapCause(logErrorCause)
            )
        );

        return () => void appRuntime.runFork(Fiber.interrupt(fiber));
    }, [engine, hasRivalFinished]);

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
