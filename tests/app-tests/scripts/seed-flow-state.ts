import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
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
import * as TestClock from 'effect/testing/TestClock';

import { isNotEmptyArray } from '@rnw-community/shared';

const UnratedChallengeLink = '_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-';
const RatedChallengeLink = '_OWP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMARgH-IAABCg';
const RatingWireScale = 10;
const LastCellIndex = 54;
const SeedElapsedSeconds = 12;
const SeedScore = 120;
const MillisecondsPerSecond = 1000;
const SeedFinishedAtMs = Date.UTC(2026, 0, 1, 12);

const fixtures = new Map([
    ['unrated-history', { link: UnratedChallengeLink, keepsFinishedRun: false }],
    ['rated-history', { link: RatedChallengeLink, keepsFinishedRun: false }],
    ['rated-result', { link: RatedChallengeLink, keepsFinishedRun: true }]
]);

const fixturesDirectory = join(import.meta.dirname, '..', 'fixtures', 'databases');

const writeFixture = Effect.fn('writeFixture')(
    function* (link: string, keepsFinishedRun: boolean, databasePath: string) {
        const sql = yield* SqlClient.SqlClient;
        const currentRunService = yield* CurrentRunService;
        const rival = new GameStateSerializer().decodeState(link);

        yield* TestClock.setTime(SeedFinishedAtMs);
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
            challengeState: link,
            isChallengeRun: true
        });
        yield* currentRunService.classifyMove({ cell: { x: 0, y: 6, value: 2, group: 6 }, technique: SolutionTechniqueEnum.FullHouse });
        yield* currentRunService.finish(true, true);

        if (!keepsFinishedRun) {
            yield* currentRunService.reset;
        }

        yield* sql`UPDATE effect_sql_migrations SET created_at = datetime(${SeedFinishedAtMs / MillisecondsPerSecond}, 'unixepoch')`;
        rmSync(databasePath, { force: true });
        yield* sql`VACUUM INTO ${databasePath}`;
    },
    Effect.provide(Layer.mergeAll(CurrentRunService.layer.pipe(Layer.provideMerge(makeTestSqlLayer())), TestClock.layer()))
);

const writeFixtures = (directory: string) =>
    Effect.forEach(fixtures, ([name, fixture]) => writeFixture(fixture.link, fixture.keepsFinishedRun, join(directory, `${name}.db`)), {
        discard: true
    });

const checkFixtures = Effect.gen(function* () {
    const directory = yield* Effect.acquireRelease(
        Effect.sync(() => mkdtempSync(join(tmpdir(), 'seed-flow-state-'))),
        temporaryDirectory => Effect.sync(() => rmSync(temporaryDirectory, { force: true, recursive: true }))
    );

    yield* writeFixtures(directory);

    const staleFixtures = [...fixtures.keys()].filter(
        name => !readFileSync(join(directory, `${name}.db`)).equals(readFileSync(join(fixturesDirectory, `${name}.db`)))
    );

    if (isNotEmptyArray(staleFixtures)) {
        return yield* Effect.die(
            `Stale seed fixtures: ${staleFixtures.join(', ')}. Regenerate them with pnpm --filter ./tests/app-tests seed:flow`
        );
    }
});

await Effect.runPromise(process.argv.includes('--check') ? Effect.scoped(checkFixtures) : writeFixtures(fixturesDirectory));
