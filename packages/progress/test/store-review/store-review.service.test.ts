import { assert, describe, it } from '@effect/vitest';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as TestClock from 'effect/testing/TestClock';

import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';
import { CurrentRunService } from '../../src/current-run/service/current-run.service';
import { StoreReviewService } from '../../src/store-review/service/store-review.service';
import { ProgressTestLayer } from '../progress-test.layer';

import type { TimelineEventType } from '../../src/current-run/type/timeline-event.type';

const hintEvent = { kind: TimelineEventKindEnum.Hint, ts: 1 } as const;

const finishWonRuns = (count: number, timelineEvents: readonly TimelineEventType[] = []) =>
    Effect.gen(function* () {
        const currentRunRepository = yield* CurrentRunRepository;
        const currentRunService = yield* CurrentRunService;

        yield* Effect.repeat(
            currentRunRepository
                .save({ ...initialCurrentRun, difficulty: DifficultyEnum.Easy, timelineEvents: [...timelineEvents] })
                .pipe(Effect.andThen(currentRunService.finish(true, false))),
            { times: count - 1 }
        );
    });

const claimAfterWin = (appVersion: string) => Effect.flatMap(StoreReviewService, storeReview => storeReview.claimAfterWin(appVersion));

describe('StoreReviewService', () => {
    it.effect('is not eligible below three won games', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(2);

            assert.isFalse(yield* claimAfterWin('1.0.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('does not count lost games toward the threshold', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(2);
            yield* Effect.flatMap(CurrentRunService, currentRunService => currentRunService.finish(false, false));

            assert.isFalse(yield* claimAfterWin('1.0.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('is eligible after the third won game and claims the request', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(3);

            assert.isTrue(yield* claimAfterWin('1.0.0'));
            assert.isFalse(yield* claimAfterWin('1.0.1'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('waits 120 days between requests', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(3);
            yield* claimAfterWin('1.0.0');
            yield* TestClock.adjust('119 days');

            assert.isFalse(yield* claimAfterWin('1.1.0'));

            yield* TestClock.adjust('1 day');

            assert.isTrue(yield* claimAfterWin('1.1.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('never requests twice for the same app version', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(3);
            yield* claimAfterWin('1.0.0');
            yield* TestClock.adjust('365 days');

            assert.isFalse(yield* claimAfterWin('1.0.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('is not eligible after a hint-assisted win', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(3, [hintEvent]);

            assert.isFalse(yield* claimAfterWin('1.0.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('is not eligible without a finished run', () =>
        Effect.gen(function* () {
            yield* finishWonRuns(3);
            yield* Effect.flatMap(CurrentRunService, currentRunService => currentRunService.reset);

            assert.isFalse(yield* claimAfterWin('1.0.0'));
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
