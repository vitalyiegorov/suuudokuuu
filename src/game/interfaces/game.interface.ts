import { InitialDateConstant } from '../../@generic/constants/date.constant';
import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

import { type CellInterface } from './cell.interface';
import { type FieldInterface } from './field.interface';

/**
 * General game state, used for logic and persisting
 */
export interface GameInterface {
    difficulty: DifficultyEnum;
    isLost: boolean;
    score: number;
    mistakes: number;
    startedAt: Date;
    endedAt: Date;
    completionPercent: number;
    filledField: FieldInterface;
    gameField: FieldInterface;
    selectedCell?: CellInterface;
    selectedValue?: number;
}

export const emptyGame: GameInterface = {
    isLost: false,
    selectedCell: undefined,
    difficulty: DifficultyEnum.Newbie,
    startedAt: InitialDateConstant,
    endedAt: InitialDateConstant,
    completionPercent: 0,
    filledField: [],
    gameField: [],
    mistakes: 0,
    score: 0
};
