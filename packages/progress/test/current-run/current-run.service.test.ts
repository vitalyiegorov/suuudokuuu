import { assert, describe, it } from '@effect/vitest';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as TestClock from 'effect/testing/TestClock';

import { CurrentRunService } from '../../src/current-run/service/current-run.service';
import { ProgressTestLayer } from '../progress-test.layer';

import { getRun, saveRun } from './current-run-fixture';

const wallClockStartMs = 1_000_000;
const millisecondsPerSecond = 1000;
const anchoredElapsedTime = 10;
const returnedElapsedTime = 25;

describe('CurrentRunService', () => {
    it.effect('separates pausing the timer from showing the pause screen and never pauses a challenge run', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* saveRun();
            yield* currentRunService.pause(false);

            assert.deepInclude(yield* getRun, { isPaused: true, shouldShowPauseScreen: false, shouldResumeOnFocus: true });
            assert.deepStrictEqual(yield* currentRunService.focus(), { isChallengeRun: false, shouldRunTimer: true });
            assert.deepInclude(yield* getRun, { isPaused: false, shouldResumeOnFocus: false });

            yield* currentRunService.pause();

            assert.deepInclude(yield* getRun, { isPaused: true, shouldShowPauseScreen: true, shouldResumeOnFocus: false });
            assert.deepStrictEqual(yield* currentRunService.focus(), { isChallengeRun: false, shouldRunTimer: false });

            yield* saveRun({ isChallengeRun: true });
            yield* currentRunService.pause();

            assert.isFalse((yield* getRun).isPaused);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('anchors and fast-forwards the challenge clock from wall time and records the time away', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* TestClock.setTime(wallClockStartMs + anchoredElapsedTime * millisecondsPerSecond);
            yield* saveRun({ isChallengeRun: true, elapsedTime: anchoredElapsedTime });
            yield* currentRunService.focus();

            assert.strictEqual((yield* getRun).wallClockStartMs, wallClockStartMs);

            yield* currentRunService.leaveRun;
            yield* currentRunService.leaveRun;
            yield* TestClock.setTime(wallClockStartMs + returnedElapsedTime * millisecondsPerSecond);
            yield* currentRunService.returnToRun();

            const { elapsedTime, timelineEvents } = yield* getRun;

            assert.strictEqual(elapsedTime, returnedElapsedTime);
            assert.deepStrictEqual(timelineEvents, [
                { kind: TimelineEventKindEnum.Away, ts: anchoredElapsedTime },
                { kind: TimelineEventKindEnum.Return, ts: returnedElapsedTime - anchoredElapsedTime }
            ]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('drops a sub-second away blip and records markers only in challenge runs', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* saveRun();
            yield* currentRunService.leaveRun;
            yield* currentRunService.screenshot;

            assert.deepStrictEqual((yield* getRun).timelineEvents, []);

            yield* saveRun({ isChallengeRun: true, wallClockStartMs: 1 });
            yield* currentRunService.leaveRun;
            yield* currentRunService.returnToRun();
            yield* currentRunService.screenshot;

            assert.deepStrictEqual((yield* getRun).timelineEvents, [{ kind: TimelineEventKindEnum.Screenshot, ts: 0 }]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('loads a shared run resumed with a fresh wall clock and resets it', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* TestClock.setTime(wallClockStartMs);
            yield* saveRun({ isPaused: true, challengeState: 'rival' });
            yield* currentRunService.load(yield* getRun);

            assert.deepInclude(yield* getRun, { isPaused: false, wallClockStartMs });

            yield* currentRunService.reset;

            assert.isTrue(Exit.isFailure(yield* Effect.exit(getRun)));
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
