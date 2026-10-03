import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Layer from 'effect/Layer';

import { CompletedGameRepository } from '../src/completed-game/repository/completed-game.repository';
import { CurrentRunRepository } from '../src/current-run/repository/current-run.repository';
import { CustomThemeRepository } from '../src/custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../src/player-stats/repository/player-stats.repository';
import { SettingsRepository } from '../src/settings/repository/settings.repository';

export const ContractsTestLayer = Layer.mergeAll(
    SettingsRepository.layer,
    CustomThemeRepository.layer,
    CurrentRunRepository.layer,
    DifficultyStatsRepository.layer,
    CompletedGameRepository.layer,
    PlayerStatsRepository.layer
).pipe(Layer.provideMerge(makeTestSqlLayer()));
