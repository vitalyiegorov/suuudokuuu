import * as Layer from 'effect/Layer';

import { CompletedGameRepository } from '../../completed-game/repository/completed-game.repository';
import { CurrentRunRepository } from '../../current-run/repository/current-run.repository';
import { CurrentRunService } from '../../current-run/service/current-run.service';
import { CustomThemeRepository } from '../../custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../../difficulty-stats/repository/difficulty-stats.repository';
import { LegacyStateImportService } from '../../legacy/service/legacy-state-import.service';
import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { SettingsRepository } from '../../settings/repository/settings.repository';
import { StoreReviewService } from '../../store-review/service/store-review.service';

export const ProgressLayer = Layer.mergeAll(
    SettingsRepository.layer,
    CustomThemeRepository.layer,
    CurrentRunRepository.layer,
    DifficultyStatsRepository.layer,
    CompletedGameRepository.layer,
    PlayerStatsRepository.layer,
    CurrentRunService.layer,
    LegacyStateImportService.layer,
    StoreReviewService.layer
);
