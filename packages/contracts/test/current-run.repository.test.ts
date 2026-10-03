import { assert, describe, it } from '@effect/vitest';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import { ReactivityKeyEnum } from '../src/@generic/enum/reactivity-key.enum';
import { CurrentRunRepository } from '../src/current-run/repository/current-run.repository';

import { ContractsTestLayer } from './contracts-test.layer';
import { trackInvalidations } from './track-invalidations.util';

import type { CurrentRunSchema } from '../src/current-run/schema/current-run.schema';

const tickedElapsedTime = 42;
const currentRun: typeof CurrentRunSchema.Type = {
    sudokuString: '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    difficulty: DifficultyEnum.Medium,
    rating: 2.6,
    isRatingCeiling: false,
    score: 1250,
    mistakes: 1,
    maxMistakes: 3,
    elapsedTime: 10,
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: true,
    showAutoCandidates: true,
    inputMode: 'candidate',
    candidates: { '2': [1, 2, 4] },
    timelineEvents: [
        { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 4, ts: 1200, technique: SolutionTechniqueEnum.NakedSingle, score: 50 },
        { kind: TimelineEventKindEnum.Pencil, cellIndex: 7, value: 6, ts: 300 },
        { kind: TimelineEventKindEnum.Pause, ts: 900 }
    ],
    undoneMoves: [{ kind: TimelineEventKindEnum.Cell, cellIndex: 9, value: 3, ts: 200 }],
    challengeTimelineEvents: [{ kind: TimelineEventKindEnum.Hint, ts: 500 }],
    challengeState: 'challenge',
    challengeTime: 321,
    wallClockStartMs: 1_760_000_000_000,
    isChallengeRun: true,
    dailyDayNumber: 20_400,
    hasNewPersonalBestScore: false
};

describe('CurrentRunRepository', () => {
    it.effect('round-trips the run and its timeline events', () =>
        Effect.gen(function* () {
            const currentRunRepository = yield* CurrentRunRepository;

            assert.isTrue(Option.isNone(yield* currentRunRepository.get));

            yield* currentRunRepository.save(currentRun);

            assert.deepStrictEqual(yield* currentRunRepository.get, Option.some(currentRun));
        }).pipe(Effect.provide(ContractsTestLayer))
    );

    it.effect('ticks the elapsed time under the run clock key only', () =>
        Effect.gen(function* () {
            const currentRunRepository = yield* CurrentRunRepository;

            yield* currentRunRepository.save(currentRun);

            const invalidatedKeys = yield* trackInvalidations;

            yield* currentRunRepository.saveElapsedTime(tickedElapsedTime);

            assert.deepStrictEqual(yield* currentRunRepository.get, Option.some({ ...currentRun, elapsedTime: tickedElapsedTime }));
            assert.deepStrictEqual(invalidatedKeys, [ReactivityKeyEnum.RunClock]);
        }).pipe(Effect.scoped, Effect.provide(ContractsTestLayer))
    );
});
