import {
    CompletedGameRepository,
    CurrentRunFinishService,
    CurrentRunMoveService,
    CurrentRunRepository,
    CurrentRunService,
    CustomThemeRepository,
    DifficultyStatsRepository,
    LegacyStateImportService,
    PlayerStatsRepository,
    SettingsRepository
} from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';

export const appServicesLayer = Layer.mergeAll(
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
);
