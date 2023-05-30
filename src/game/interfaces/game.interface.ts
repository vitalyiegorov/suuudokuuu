import { InitialDateConstant } from '../../@generic/constants/date.constant';
import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';
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

export const emptyGame: GameInterface = {
    isLost: false,
    availableValues: [],
    // eslint-disable-next-line no-undefined
    selectedCell: undefined,
    difficulty: DifficultyEnum.Newbie,
    startedAt: InitialDateConstant,
    endedAt: InitialDateConstant,
    mistakes: 0,
    score: 0,
    // eslint-disable-next-line no-undefined
    scoredCells: undefined
};
