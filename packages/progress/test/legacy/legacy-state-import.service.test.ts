import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';

import seedState from '../../../../tests/app-tests/fixtures/screenshot-seed-state.json';
import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';
import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
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
