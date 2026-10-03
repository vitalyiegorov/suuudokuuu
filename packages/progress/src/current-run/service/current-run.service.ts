import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import * as Clock from 'effect/Clock';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';

import { initialCurrentRun } from '../constant/initial-current-run.constant';
import { CurrentRunRepository } from '../repository/current-run.repository';
import { getTimelineTimestampDelta } from '../utils/get-timeline-timestamp-delta.util';
import { withTimelineMarker } from '../utils/with-timeline-marker.util';

import type { CurrentRunType } from '../type/current-run.type';

type CurrentRunSetupType = Pick<
    CurrentRunType,
    'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'isRatingCeiling' | 'maxMistakes' | 'rating' | 'sudokuString'
>;

const MillisecondsPerSecond = 1000;

const isLastEventAway = (run: CurrentRunType): boolean => run.timelineEvents.at(-1)?.kind === TimelineEventKindEnum.Away;

const resumeRun = (run: CurrentRunType): CurrentRunType => ({
    ...run,
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: false
});

const syncChallengeClock = (run: CurrentRunType, nowMs: number): CurrentRunType => {
    if (!run.isChallengeRun) {
        return run;
    }

    if (run.wallClockStartMs === 0) {
        return { ...run, wallClockStartMs: nowMs - run.elapsedTime * MillisecondsPerSecond };
    }

    const wallElapsedSeconds = Math.floor((nowMs - run.wallClockStartMs) / MillisecondsPerSecond);

    return wallElapsedSeconds > run.elapsedTime ? { ...run, elapsedTime: wallElapsedSeconds } : run;
};

const returnToRun = (run: CurrentRunType, nowMs: number): CurrentRunType => {
    const syncedRun = syncChallengeClock(run, nowMs);

    if (!isLastEventAway(syncedRun)) {
        return syncedRun;
    }

    if (getTimelineTimestampDelta(syncedRun) === 0) {
        return { ...syncedRun, timelineEvents: syncedRun.timelineEvents.slice(0, -1) };
    }

    return withTimelineMarker(syncedRun, TimelineEventKindEnum.Return);
};

const pauseRun = (run: CurrentRunType, shouldShowPauseScreen: boolean): CurrentRunType =>
    run.isChallengeRun ? run : { ...run, isPaused: true, shouldShowPauseScreen, shouldResumeOnFocus: !shouldShowPauseScreen };

export class CurrentRunService extends Context.Service<CurrentRunService>()('@suuudokuuu/progress/CurrentRunService', {
    make: Effect.gen(function* () {
        const currentRunRepository = yield* CurrentRunRepository;

        return {
            start: (setup: CurrentRunSetupType) => currentRunRepository.save({ ...initialCurrentRun, ...setup }),
            load: Effect.fn('CurrentRunService.load')(function* (run: CurrentRunType) {
                const nowMs = yield* Clock.currentTimeMillis;
                const needsWallClock = run.challengeState !== '' || run.isChallengeRun;

                yield* currentRunRepository.save(resumeRun({ ...run, ...(needsWallClock && { wallClockStartMs: nowMs }) }));
            }),
            reset: currentRunRepository.take,
            tick: currentRunRepository.tick,
            pause: (shouldShowPauseScreen = true) => currentRunRepository.update(run => pauseRun(run, shouldShowPauseScreen)),
            resume: currentRunRepository.update(resumeRun),
            focus: Effect.fn('CurrentRunService.focus')(function* () {
                const nowMs = yield* Clock.currentTimeMillis;
                const currentRun = yield* currentRunRepository.get;

                if (Option.isNone(currentRun)) {
                    return { isChallengeRun: false, shouldRunTimer: false };
                }

                const { isChallengeRun, isPaused, shouldResumeOnFocus } = currentRun.value;

                yield* currentRunRepository.update(run => {
                    const resumedRun = isPaused && shouldResumeOnFocus ? resumeRun(run) : run;

                    return isChallengeRun ? returnToRun(resumedRun, nowMs) : resumedRun;
                });

                return { isChallengeRun, shouldRunTimer: !isPaused || shouldResumeOnFocus };
            }),
            returnToRun: Effect.fn('CurrentRunService.returnToRun')(function* () {
                const nowMs = yield* Clock.currentTimeMillis;

                yield* currentRunRepository.update(run => returnToRun(run, nowMs));
            }),
            leaveRun: currentRunRepository.update(run =>
                !run.isChallengeRun || isLastEventAway(run) ? run : withTimelineMarker(run, TimelineEventKindEnum.Away)
            ),
            screenshot: currentRunRepository.update(run =>
                run.isChallengeRun ? withTimelineMarker(run, TimelineEventKindEnum.Screenshot) : run
            )
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunService, CurrentRunService.make).pipe(Layer.provide(CurrentRunRepository.layer));
}
