import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GameStateSerializer, TimelineEventKindEnum, applyCellEventsToField } from '@suuudokuuu/encoder';
import { DifficultyEnum } from '@suuudokuuu/generator';
import {
    BackupService,
    CurrentRunRepository,
    CurrentRunService,
    ProgressLayer,
    SettingsRepository,
    ThemeEnum,
    initialCurrentRun
} from '@suuudokuuu/progress';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as SqlClient from 'effect/sql/SqlClient';
import * as TestClock from 'effect/testing/TestClock';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import type { CurrentRunType, SettingsType } from '@suuudokuuu/progress';

const UnratedChallengeLink = '_KGP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMCP-';
const RatedChallengeLink = '_OWP________9____qXF6FFdMjBWGhJIN-CMqSm5omCUw0KFUm6-t2HxLUAuYMARgH-IAABCg';
const RatingWireScale = 10;
const LastCellIndex = 54;
const SeedElapsedSeconds = 12;
const SeedScore = 120;
const MillisecondsPerSecond = 1000;
const SeedFinishedAtMs = Date.parse('2026-01-01T12:00:00Z');
const ScreenshotChallengeLink =
    '_KAOADKxQxGAEwAiG0eSR7tZLUwnibscwQ0-A5fIIKC45kkWcIIQQQRgYUgCGSyNYgAAAAAAAAAAAAASWSrfOcD6yrHa0SAMNhPEITYFvbWxiFMlBQUFBQUFBQUFBQUFBQUFCQkFAgICAgICBQIFCQIJCQUFCQkFAgICAgICAgICAgICAgICAgICAgICAgIA';

const screenshotSettings: SettingsType = {
    hasVibration: true,
    hasTimer: true,
    showAreas: true,
    showIdenticalNumbers: true,
    showComboAnimation: true,
    showFilledNumbers: true,
    showActiveCandidates: true,
    keepActiveCell: true,
    keepExhaustedDigits: true,
    allowHintsOnHardDifficulties: true,
    isLeftHanded: false,
    calmMode: false,
    motionPreference: 'system',
    fontSize: 'm',
    language: 'en',
    theme: ThemeEnum.BlackAndWhite,
    isDarkColorSchema: true,
    cellMargin: 5,
    lastGameDifficulty: DifficultyEnum.Hell,
    lastGameMaxMistakes: 3,
    lastGameChallengeMode: false,
    lastStatsDifficulty: DifficultyEnum.Easy
};

const fixturesDirectory = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'fixtures');
const databasesDirectory = join(fixturesDirectory, 'databases');
const screenshotRival = new GameStateSerializer().decodeState(ScreenshotChallengeLink);

const seedChallengeHistory = Effect.fn('seedChallengeHistory')(function* (link: string, keepsFinishedRun: boolean) {
    const currentRunService = yield* CurrentRunService;
    const rival = new GameStateSerializer().decodeState(link);

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
});

const seedScreenshot = Effect.fn('seedScreenshot')(function* (settings: SettingsType, run?: Partial<CurrentRunType>) {
    const settingsRepository = yield* SettingsRepository;
    const backupService = yield* BackupService;
    const currentRunRepository = yield* CurrentRunRepository;

    yield* settingsRepository.initialize(settings);
    yield* backupService.importBackup(readFileSync(join(fixturesDirectory, 'screenshot-backup.json'), 'utf8')).pipe(Effect.orDie);

    if (isDefined(run)) {
        yield* currentRunRepository.save({ ...initialCurrentRun, ...run });
    }
});

const fixtures = new Map<string, Effect.Effect<void, never, Layer.Success<typeof ProgressLayer>>>([
    ['unrated-history', seedChallengeHistory(UnratedChallengeLink, false)],
    ['rated-history', seedChallengeHistory(RatedChallengeLink, false)],
    ['rated-result', seedChallengeHistory(RatedChallengeLink, true)],
    ['screenshot', seedScreenshot(screenshotSettings)],
    [
        'screenshot-hero',
        seedScreenshot(screenshotSettings, {
            sudokuString: '9.31........48.2.9...5.....69..........2....8.5...79.4......7.321...6..........4.',
            difficulty: DifficultyEnum.Nightmare,
            rating: 8,
            elapsedTime: 12,
            candidates: { '4-4': [2, 5, 8], '2-6': [1, 4], '6-2': [3, 7, 9] },
            timelineEvents: [
                { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 9, ts: 6, technique: SolutionTechniqueEnum.PointingPair }
            ]
        })
    ],
    [
        'screenshot-challenge-live',
        seedScreenshot(screenshotSettings, {
            sudokuString: '9...........18..2.8.34...1.5....63...6...84..........9..85..........7...3....98.4',
            difficulty: DifficultyEnum.Nightmare,
            elapsedTime: 45,
            challengeState: ScreenshotChallengeLink,
            challengeTimelineEvents: screenshotRival.timelineEvents,
            challengeTime: screenshotRival.elapsedTime,
            isChallengeRun: true
        })
    ],
    [
        'screenshot-infinity',
        seedScreenshot(screenshotSettings, {
            sudokuString: '800000000003600000070090200050007000000045700000100030001000068008500010090000400',
            difficulty: DifficultyEnum.Infinity,
            rating: 11.9,
            elapsedTime: 12,
            candidates: { '4-4': [2, 5, 8] },
            timelineEvents: [
                { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 8, ts: 6, technique: SolutionTechniqueEnum.HiddenSingle }
            ]
        })
    ],
    [
        'screenshot-preview',
        seedScreenshot(
            { ...screenshotSettings, hasTimer: false },
            {
                sudokuString: '9..172586165.8..7.82756.43.69...8.57..1...3.8..86.7....869...1......6895.39..164.',
                difficulty: DifficultyEnum.Medium,
                rating: 1.5,
                elapsedTime: 74
            }
        )
    ]
]);

const writeFixture = Effect.fn('writeFixture')(function* (databasePath: string) {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`UPDATE effect_sql_migrations SET created_at = datetime(${SeedFinishedAtMs / MillisecondsPerSecond}, 'unixepoch')`;
    rmSync(databasePath, { force: true });
    yield* sql`VACUUM INTO ${databasePath}`;
});

const writeFixtures = (directory: string) =>
    Effect.forEach(
        fixtures,
        ([name, seed]) =>
            TestClock.setTime(SeedFinishedAtMs).pipe(
                Effect.andThen(seed),
                Effect.andThen(writeFixture(join(directory, `${name}.db`))),
                Effect.provide([ProgressLayer.pipe(Layer.provideMerge(makeTestSqlLayer())), TestClock.layer()])
            ),
        { discard: true }
    );

const readContent = Effect.fn('readContent')(function* (databasePath: string) {
    const sql = yield* SqlClient.SqlClient;

    yield* sql`ATTACH DATABASE ${databasePath} AS inspected`;

    const schema = yield* sql.unsafe('SELECT type, name, sql FROM inspected.sqlite_master ORDER BY type, name');
    const tableNames = yield* sql.unsafe<{ readonly name: string }>(
        "SELECT name FROM inspected.sqlite_master WHERE type = 'table' ORDER BY name"
    );
    const tables = yield* Effect.forEach(tableNames, ({ name }) => sql.unsafe(`SELECT * FROM inspected."${name}" ORDER BY rowid`));

    return JSON.stringify([schema, tables]);
}, Effect.provide(makeTestSqlLayer()));

const checkFixtures = Effect.gen(function* () {
    const directory = yield* Effect.acquireRelease(
        Effect.sync(() => mkdtempSync(join(tmpdir(), 'seed-database-fixtures-'))),
        temporaryDirectory => Effect.sync(() => void rmSync(temporaryDirectory, { force: true, recursive: true }))
    );

    yield* writeFixtures(directory);

    const staleFixtures = yield* Effect.filter([...fixtures.keys()], name =>
        Effect.map(
            Effect.all([readContent(join(directory, `${name}.db`)), readContent(join(databasesDirectory, `${name}.db`))]),
            ([generated, committed]) => generated !== committed
        )
    );

    return yield* isNotEmptyArray(staleFixtures)
        ? Effect.die(`Stale seed fixtures: ${staleFixtures.join(', ')}. Regenerate them with pnpm --filter ./tests/app-tests seed:fixtures`)
        : Effect.void;
});

await Effect.runPromise(process.argv.includes('--check') ? Effect.scoped(checkFixtures) : writeFixtures(databasesDirectory));
