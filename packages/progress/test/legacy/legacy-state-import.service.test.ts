import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as Option from 'effect/Option';
import * as SqlClient from 'effect/sql/SqlClient';

import seedState from '../../../../tests/app-tests/fixtures/screenshot-seed-state.json';
import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';
import { ColorSchemaEnum } from '../../src/custom-theme/enum/color-schema.enum';
import { ThemeEnum } from '../../src/custom-theme/enum/theme.enum';
import { CustomThemeRepository } from '../../src/custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
import { LegacyKvStoreConstant } from '../../src/legacy/constant/legacy-kv-store.constant';
import { LegacyStateImportService } from '../../src/legacy/service/legacy-state-import.service';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { SettingsRepository } from '../../src/settings/repository/settings.repository';
import { initialSettings, themeColors } from '../progress-fixtures';
import { ProgressTestLayer } from '../progress-test.layer';

const SeedPersistVersion = 40;

const buildPersistedRoot = (game: object) =>
    JSON.stringify({
        _persist: JSON.stringify({ rehydrated: true, version: SeedPersistVersion }),
        customThemes: JSON.stringify(seedState.customThemes),
        game: JSON.stringify(game),
        settings: JSON.stringify(seedState.settings)
    });

const importPersistedRoot = (persistedRoot: string) =>
    Effect.flatMap(LegacyStateImportService, legacyStateImportService =>
        legacyStateImportService.importPersistedRoot(persistedRoot, () => themeColors)
    );

describe('LegacyStateImportService', () => {
    it.effect('imports a seeded redux-persist root into every table and replaces it on re-import', () =>
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;
            const currentRunRepository = yield* CurrentRunRepository;
            const difficultyStatsRepository = yield* DifficultyStatsRepository;
            const completedGameRepository = yield* CompletedGameRepository;
            const playerStatsRepository = yield* PlayerStatsRepository;
            const heroGame = { ...seedState.game, ...seedState.sceneStates.hero };

            yield* settingsRepository.initialize(initialSettings);
            yield* importPersistedRoot(buildPersistedRoot(heroGame));
            yield* importPersistedRoot(buildPersistedRoot(heroGame));

            const settings = yield* settingsRepository.get;
            const currentRun = yield* currentRunRepository.get;
            const newbieStats = yield* difficultyStatsRepository.findByDifficulty(DifficultyEnum.Newbie);
            const playerStats = yield* playerStatsRepository.get;

            assert.deepStrictEqual(settings, { ...initialSettings, ...seedState.settings });
            assert.deepStrictEqual(
                Option.map(currentRun, run => [run.sudokuString, run.score, run.undoneMoves]),
                Option.some([heroGame.sudokuString, heroGame.score, []])
            );
            const newbieHistory = seedState.game.historyByDifficulty.Newbie;

            assert.deepStrictEqual(
                [newbieStats.gamesWon, newbieStats.bestScore, newbieStats.bestRating],
                [newbieHistory.gamesWon, newbieHistory.bestScore, newbieHistory.bestRating.rating]
            );
            assert.strictEqual(
                (yield* completedGameRepository.findAll).length,
                Object.values(seedState.game.historyByDifficulty).flatMap(history => history.completedGames).length
            );
            assert.deepStrictEqual(playerStats.techniqueUsageCounts, seedState.game.techniqueUsageCounts);
            assert.deepStrictEqual(playerStats.dailyCompletedDayNumbers, []);

            yield* importPersistedRoot(buildPersistedRoot(seedState.game));

            assert.isTrue(Option.isNone(yield* currentRunRepository.get));
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});

it.effect('rejects malformed legacy slices before replacing existing player data', () =>
    Effect.gen(function* () {
        const settingsRepository = yield* SettingsRepository;
        const completedGameRepository = yield* CompletedGameRepository;

        yield* settingsRepository.initialize(initialSettings);
        yield* importPersistedRoot(buildPersistedRoot(seedState.game));
        const savedGames = yield* completedGameRepository.findAll;
        const savedSettings = yield* settingsRepository.get;
        const malformedRoot = JSON.stringify({
            _persist: JSON.stringify({ version: SeedPersistVersion }),
            game: JSON.stringify({ ...seedState.game, score: 'invalid-score' }),
            settings: JSON.stringify(seedState.settings)
        });
        const result = yield* Effect.exit(importPersistedRoot(malformedRoot));

        assert.isTrue(Exit.isFailure(result));
        assert.deepStrictEqual(yield* completedGameRepository.findAll, savedGames);
        assert.deepStrictEqual(yield* settingsRepository.get, savedSettings);
    }).pipe(Effect.provide(ProgressTestLayer))
);

it.effect('reads the persisted root from an expo-sqlite kv-store table and deletes it after the import', () =>
    Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const settingsRepository = yield* SettingsRepository;

        yield* settingsRepository.initialize(initialSettings);
        yield* sql`CREATE TABLE storage (key TEXT PRIMARY KEY NOT NULL, value TEXT)`;
        yield* sql`INSERT INTO storage (key, value) VALUES ('persist:root', ${buildPersistedRoot(seedState.game)})`;

        const [{ value: persistedRoot }] = yield* sql.unsafe<{ readonly value: string }>(LegacyKvStoreConstant.selectPersistedRootSql);

        yield* importPersistedRoot(persistedRoot);
        yield* sql.unsafe(LegacyKvStoreConstant.deletePersistedRootSql);

        assert.deepStrictEqual(yield* settingsRepository.get, { ...initialSettings, ...seedState.settings });
        assert.deepStrictEqual(yield* sql.unsafe(LegacyKvStoreConstant.selectPersistedRootSql), []);
    }).pipe(Effect.provide(ProgressTestLayer))
);

it.effect('imports pre-v12 root history with missing modern fields and a scalar best rating', () =>
    Effect.gen(function* () {
        const settingsRepository = yield* SettingsRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const completedGameRepository = yield* CompletedGameRepository;

        yield* settingsRepository.initialize(initialSettings);
        yield* importPersistedRoot(
            JSON.stringify({
                _persist: JSON.stringify({ version: 11 }),
                settings: JSON.stringify({ hasTimer: false }),
                history: JSON.stringify({
                    byDifficulty: {
                        Easy: {
                            difficulty: DifficultyEnum.Easy,
                            gamesWon: 2,
                            bestRating: 3.4,
                            completedGames: [
                                {
                                    difficulty: DifficultyEnum.Easy,
                                    encodedState: 'historical-state',
                                    elapsedTime: 60,
                                    score: 100,
                                    mistakes: 0,
                                    maxMistakes: 3,
                                    completedAt: 1700000000000
                                }
                            ]
                        }
                    }
                })
            })
        );

        const history = yield* difficultyStatsRepository.findByDifficulty(DifficultyEnum.Easy);
        const games = yield* completedGameRepository.findAll;

        assert.strictEqual(history.gamesWon, 2);
        assert.strictEqual(history.bestRating, 0);
        assert.strictEqual(games.length, 1);
        assert.strictEqual(games[0].encodedState, 'historical-state');
        assert.strictEqual(games[0].rating, 0);
        assert.isFalse((yield* settingsRepository.get).hasTimer);
    }).pipe(Effect.provide(ProgressTestLayer))
);

it.effect('imports a pre-v31 custom theme without a schema version and with partial legacy colors', () =>
    Effect.gen(function* () {
        const settingsRepository = yield* SettingsRepository;
        const customThemeRepository = yield* CustomThemeRepository;

        yield* settingsRepository.initialize(initialSettings);
        yield* importPersistedRoot(
            JSON.stringify({
                _persist: JSON.stringify({ version: 30 }),
                customThemes: JSON.stringify({
                    themes: [
                        {
                            id: 'custom-legacy',
                            name: 'Historical theme',
                            sourceTheme: ThemeEnum.Colorful,
                            colors: {
                                [ColorSchemaEnum.Light]: { background: '#112233', label: { main: '#445566' } },
                                [ColorSchemaEnum.Dark]: {}
                            },
                            createdAt: 1700000000000,
                            updatedAt: 1700000000000
                        }
                    ]
                })
            })
        );

        const themes = yield* customThemeRepository.findAll;

        assert.strictEqual(themes.length, 1);
        assert.strictEqual(themes[0].schemaVersion, 2);
        assert.strictEqual(themes[0].colors[ColorSchemaEnum.Light].background, '#112233');
        assert.strictEqual(themes[0].colors[ColorSchemaEnum.Light].text.primary, '#445566');
        assert.deepStrictEqual(themes[0].colors[ColorSchemaEnum.Dark], themeColors);
    }).pipe(Effect.provide(ProgressTestLayer))
);

const beforeFirstHistoryPersistVersion = 11;
const beforeTimelinePersistVersion = 27;
const beforeSemanticThemePersistVersion = 30;

for (const inboundVersion of [
    beforeFirstHistoryPersistVersion,
    beforeTimelinePersistVersion,
    beforeSemanticThemePersistVersion,
    SeedPersistVersion
]) {
    it.effect(`discards obsolete undo and daily fields before decoding version ${inboundVersion}`, () =>
        Effect.gen(function* () {
            const settingsRepository = yield* SettingsRepository;
            const currentRunRepository = yield* CurrentRunRepository;
            const playerStatsRepository = yield* PlayerStatsRepository;

            yield* settingsRepository.initialize(initialSettings);
            yield* importPersistedRoot(
                JSON.stringify({
                    _persist: JSON.stringify({ version: inboundVersion }),
                    game: JSON.stringify({
                        ...seedState.game,
                        ...seedState.sceneStates.hero,
                        undoneMoves: [{ cell: { x: 1, y: 2 }, value: 3 }],
                        dailyDayNumber: 'legacy-day',
                        dailyCompletedDayNumbers: ['legacy-day'],
                        dailyBestStreak: 'legacy-streak'
                    }),
                    settings: JSON.stringify(seedState.settings)
                })
            );

            const currentRun = Option.getOrThrow(yield* currentRunRepository.get);
            const playerStats = yield* playerStatsRepository.get;

            assert.deepStrictEqual(currentRun.undoneMoves, []);
            assert.strictEqual(currentRun.dailyDayNumber, 0);
            assert.deepStrictEqual(playerStats.dailyCompletedDayNumbers, []);
            assert.strictEqual(playerStats.dailyBestStreak, 0);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
}
