import type { DailyWeekDayStateEnum } from '../enums/daily-week-day-state.enum';
import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface DailyWeekDayInterface {
    readonly dayNumber: number;
    readonly difficulty: DifficultyEnum;
    readonly isLinkedToNext: boolean;
    readonly isLinkedToPrevious: boolean;
    readonly state: DailyWeekDayStateEnum;
}
