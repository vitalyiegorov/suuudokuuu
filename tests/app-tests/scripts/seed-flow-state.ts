import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { GameStateSerializer, TimelineEventKindEnum, applyCellEventsToField } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { CurrentRunService, initialCurrentRun } from '@suuudokuuu/progress';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as SqlClient from 'effect/sql/SqlClient';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { installDatabase } from './seed-app-state.ts';

const UnratedChallengeLink = '_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-';
const RatedChallengeLink = '_OWP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMARgH-IAABCg';
const RatingWireScale = 10;
const LastCellIndex = 54;
const SeedElapsedSeconds = 12;
const SeedScore = 120;

const fixtures = new Map([
    ['unrated-history', { link: UnratedChallengeLink, keepsFinishedRun: false }],
    ['rated-history', { link: RatedChallengeLink, keepsFinishedRun: false }],
    ['rated-result', { link: RatedChallengeLink, keepsFinishedRun: true }]
]);

const { APP_ID = '', ANDROID_SERIAL = '', SEED_FIXTURE = '', SIMULATOR_UDID = '' } = process.env;

const seedFlowState = Effect.gen(function* () {
    const fixture = fixtures.get(SEED_FIXTURE);

    if (!isDefined(fixture) || !isNotEmptyString(APP_ID)) {
        return yield* Effect.die(`SEED_FIXTURE must be one of ${[...fixtures.keys()].join(', ')} and APP_ID must be set`);
    }

    const sql = yield* SqlClient.SqlClient;
    const currentRunService = yield* CurrentRunService;
    const rival = new GameStateSerializer().decodeState(fixture.link);
    const databaseDirectory = yield* Effect.acquireRelease(
        Effect.sync(() => mkdtempSync(join(tmpdir(), 'seed-flow-state-'))),
        directory => Effect.sync(() => rmSync(directory, { force: true, recursive: true }))
    );
    const databasePath = join(databaseDirectory, 'seed.db');

    yield* currentRunService.load({
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
        challengeState: fixture.link,
        isChallengeRun: true
    });
    yield* currentRunService.classifyMove({ cell: { x: 0, y: 6, value: 2, group: 6 }, technique: SolutionTechniqueEnum.FullHouse });
    yield* currentRunService.finish(true, true);

    if (!fixture.keepsFinishedRun) {
        yield* currentRunService.reset;
    }

    yield* sql`VACUUM INTO ${databasePath}`;
    installDatabase(
        { appId: APP_ID, platform: isNotEmptyString(SIMULATOR_UDID) ? 'ios' : 'android', serial: ANDROID_SERIAL, udid: SIMULATOR_UDID },
        databasePath
    );
});

await Effect.runPromise(
    seedFlowState.pipe(Effect.scoped, Effect.provide(CurrentRunService.layer.pipe(Layer.provideMerge(makeTestSqlLayer()))))
);
