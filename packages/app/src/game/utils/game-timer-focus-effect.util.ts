import { CurrentRunService } from '@suuudokuuu/progress';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import * as Schedule from 'effect/Schedule';
import { AppState } from 'react-native';

import { isDefined } from '@rnw-community/shared';

export const gameTimerFocusEffect = (openPauseScreen: () => void) =>
    Effect.gen(function* () {
        const currentRunService = yield* CurrentRunService;
        const appStates = yield* Queue.unbounded<string>();

        yield* Effect.acquireRelease(
            Effect.sync(() => {
                const subscription = AppState.addEventListener('change', appState => void Queue.offerUnsafe(appStates, appState));
                const initialAppState = AppState.currentState;

                if (isDefined(initialAppState) && initialAppState !== 'active') {
                    Queue.offerUnsafe(appStates, initialAppState);
                }

                return subscription;
            }),
            subscription => Effect.sync(() => void subscription.remove())
        );

        const { isChallengeRun, shouldRunTimer } = yield* Effect.uninterruptible(currentRunService.focus());

        if (!shouldRunTimer) {
            return;
        }

        yield* Effect.addFinalizer(() => currentRunService.stopClock);

        const tickForever = Effect.repeat(currentRunService.tick, Schedule.spaced(Duration.seconds(1)));
        const nextAppState = Queue.take(appStates);

        const runChallengeTimer = (isTicking: boolean): Effect.Effect<void> =>
            Effect.gen(function* () {
                const appState = isTicking ? yield* Effect.raceFirst(tickForever, nextAppState) : yield* nextAppState;

                if (appState === 'active') {
                    yield* Effect.uninterruptible(currentRunService.returnToRun);
                }

                if (appState === 'background') {
                    yield* Effect.uninterruptible(currentRunService.leaveRun);
                }

                yield* runChallengeTimer(appState === 'active');
            });

        const pauseOnBackground = Effect.raceFirst(
            tickForever,
            Effect.repeat(nextAppState, { until: appState => appState !== 'active' })
        ).pipe(Effect.andThen(Effect.uninterruptible(currentRunService.pause())), Effect.andThen(Effect.sync(openPauseScreen)));

        yield* isChallengeRun ? runChallengeTimer(true) : pauseOnBackground;
    }).pipe(Effect.scoped);
