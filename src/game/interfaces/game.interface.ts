import { type DifficultyEnum } from '../../@generic/enums/difficulty.enum';
import type { CellInterface, ScoredCellsInterface } from '../../@logic';

export interface GameInterface {
    difficulty: DifficultyEnum;
    isLost: boolean;
    score: number;
    mistakes: number;
    startedAt: Date;
    endedAt: Date;
    selectedCell?: CellInterface;
    scoredCells?: ScoredCellsInterface;
    availableValues: number[];
}
