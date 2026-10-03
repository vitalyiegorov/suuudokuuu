import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Layer from 'effect/Layer';

import { CompletedGameRepository } from '../src/completed-game/repository/completed-game.repository';
import { CurrentRunRepository } from '../src/current-run/repository/current-run.repository';
import { CurrentRunFinishService } from '../src/current-run/service/current-run-finish.service';
import { CurrentRunMoveService } from '../src/current-run/service/current-run-move.service';
import { CurrentRunService } from '../src/current-run/service/current-run.service';
import { CustomThemeRepository } from '../src/custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../src/difficulty-stats/repository/difficulty-stats.repository';
import { LegacyStateImportService } from '../src/legacy/service/legacy-state-import.service';
import { PlayerStatsRepository } from '../src/player-stats/repository/player-stats.repository';
import { SettingsRepository } from '../src/settings/repository/settings.repository';

export const ProgressTestLayer = Layer.mergeAll(
    SettingsRepository.layer,
    CustomThemeRepository.layer,
    CurrentRunRepository.layer,
    DifficultyStatsRepository.layer,
    CompletedGameRepository.layer,
    PlayerStatsRepository.layer,
    CurrentRunService.layer,
    CurrentRunMoveService.layer,
    CurrentRunFinishService.layer,
    LegacyStateImportService.layer
).pipe(Layer.provideMerge(makeTestSqlLayer()));
