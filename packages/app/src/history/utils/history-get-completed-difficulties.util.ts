import { DifficultyComplexitySliderDifficulties } from '../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';

import type { HistoryGameInterface } from '../interfaces/history-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export const historyGetCompletedDifficulties = (historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>) =>
    DifficultyComplexitySliderDifficulties.filter(difficulty => historyByDifficulty[difficulty].gamesCompleted > 0);
