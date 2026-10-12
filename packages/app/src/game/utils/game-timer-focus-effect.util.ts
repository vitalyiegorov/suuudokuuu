import { CurrentRunRepository, CurrentRunService } from '@suuudokuuu/progress';
import * as Duration from 'effect/Duration';
import * as Effect from 'effect/Effect';
import * as Queue from 'effect/Queue';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

export const gameTimerFocusEffect = (openPauseScreen: () => void) =>
    Effect.gen(function* () {
        const currentRunService = yield* CurrentRunService;
        const currentRunRepository = yield* CurrentRunRepository;
        const { isChallengeRun, shouldRunTimer } = yield* currentRunService.focus();

        if (!shouldRunTimer) {
            return;
        }

        const appStates = yield* Queue.unbounded<AppStateStatus>();

        yield* Effect.acquireRelease(
            Effect.sync(() => AppState.addEventListener('change', appState => void Queue.offerUnsafe(appStates, appState))),
            subscription => Effect.sync(() => void subscription.remove())
        );

        const tickForever = Effect.forever(Effect.andThen(Effect.sleep(Duration.seconds(1)), currentRunRepository.tick));
        const nextAppState = Queue.take(appStates);

        const runChallengeTimer = (isTicking: boolean): Effect.Effect<void> =>
            Effect.gen(function* () {
                const appState = isTicking ? yield* Effect.raceFirst(tickForever, nextAppState) : yield* nextAppState;

                if (appState === 'active') {
                    yield* currentRunService.returnToRun;
                }

                if (appState === 'background') {
                    yield* currentRunService.leaveRun;
                }

                yield* runChallengeTimer(appState === 'active');
            });

        const pauseOnBackground = Effect.raceFirst(
            tickForever,
            Effect.repeat(nextAppState, { until: appState => appState !== 'active' })
        ).pipe(Effect.andThen(currentRunService.pause()), Effect.andThen(Effect.sync(openPauseScreen)));

        yield* isChallengeRun ? runChallengeTimer(true) : pauseOnBackground;
    }).pipe(Effect.scoped);
