import {
    CompletedGameRepository,
    CurrentRunRepository,
    CustomThemeRepository,
    DifficultyStatsRepository,
    PlayerStatsRepository,
    SettingsRepository
} from '@suuudokuuu/contracts';
import * as Layer from 'effect/Layer';

export const appServicesLayer = Layer.mergeAll(
    SettingsRepository.layer,
    CustomThemeRepository.layer,
    CurrentRunRepository.layer,
    DifficultyStatsRepository.layer,
    CompletedGameRepository.layer,
    PlayerStatsRepository.layer
);
