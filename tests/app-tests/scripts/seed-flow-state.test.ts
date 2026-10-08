import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { it } from '@effect/vitest';
import { GameStateSerializer, TimelineEventKindEnum, applyCellEventsToField } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CurrentRunRepository, CurrentRunService, ProgressLayer, initialCurrentRun } from '@suuudokuuu/progress';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Clock from 'effect/Clock';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';

import { installDatabase } from './seed-app-state.ts';

const UnratedChallengeLink = '_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-';
const RatedChallengeLink = '_OWP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMARgH-IAABCg';
const MillisecondsPerSecond = 1000;
const RatingWireScale = 10;
const LastCellIndex = 54;
const SeedElapsedSeconds = 12;
const SeedScore = 120;

const fixtures = new Map([
    ['unrated-history', { link: UnratedChallengeLink, keepsFinishedRun: false }],
    ['rated-history', { link: RatedChallengeLink, keepsFinishedRun: false }],
    ['rated-result', { link: RatedChallengeLink, keepsFinishedRun: true }]
]);

const serializer = new GameStateSerializer();

const seedFinishedChallengeWin = (link: string, keepsFinishedRun: boolean) =>
    Effect.gen(function* () {
        const currentRunService = yield* CurrentRunService;
        const currentRunRepository = yield* CurrentRunRepository;
        const nowMs = yield* Clock.currentTimeMillis;
        const rival = serializer.decodeState(link);

        yield* currentRunRepository.save({
            ...initialCurrentRun,
            sudokuString: applyCellEventsToField(rival.field, rival.timelineEvents),
            difficulty: DifficultyEnum.Newbie,
            rating: rival.rating / RatingWireScale,
            isRatingCeiling: rival.isRatingCeiling,
            maxMistakes: rival.maxMistakes,
            score: SeedScore,
            elapsedTime: SeedElapsedSeconds,
            timelineEvents: [
                { kind: TimelineEventKindEnum.Cell, cellIndex: LastCellIndex, value: 2, ts: SeedElapsedSeconds, score: SeedScore }
            ],
            challengeTimelineEvents: rival.timelineEvents,
            challengeTime: rival.elapsedTime,
            challengeState: link,
            isChallengeRun: true,
            wallClockStartMs: nowMs - SeedElapsedSeconds * MillisecondsPerSecond
        });
        yield* currentRunService.classifyMove({ cell: { x: 0, y: 6, value: 2, group: 6 }, technique: SolutionTechniqueEnum.FullHouse });
        yield* currentRunService.finish(true, true);

        if (!keepsFinishedRun) {
            yield* currentRunService.reset;
        }
    });

it.effect('seeds the database the flow asks for', () =>
    Effect.gen(function* () {
        const { APP_ID = '', ANDROID_SERIAL = '', SEED_FIXTURE = '', SIMULATOR_UDID = '' } = process.env;
        const fixture = fixtures.get(SEED_FIXTURE);

        if (fixture === undefined || APP_ID === '') {
            return yield* Effect.die(`SEED_FIXTURE must be one of ${[...fixtures.keys()].join(', ')} and APP_ID must be set`);
        }

        const databaseDirectory = yield* Effect.acquireRelease(
            Effect.sync(() => mkdtempSync(join(tmpdir(), 'seed-flow-state-'))),
            directory => Effect.sync(() => void rmSync(directory, { force: true, recursive: true }))
        );
        const databasePath = join(databaseDirectory, 'seed.db');

        yield* seedFinishedChallengeWin(fixture.link, fixture.keepsFinishedRun).pipe(
            Effect.provide(ProgressLayer.pipe(Layer.provideMerge(makeTestSqlLayer(databasePath))))
        );

        const platform = SIMULATOR_UDID === '' ? 'android' : 'ios';

        installDatabase({ appId: APP_ID, platform, serial: ANDROID_SERIAL, udid: SIMULATOR_UDID }, databasePath);
    }).pipe(Effect.scoped)
);
