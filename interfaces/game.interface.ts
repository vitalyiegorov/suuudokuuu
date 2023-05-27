import { InitialDateConstant } from '../constants/date.constant';
import { DifficultyEnum } from '../enums/difficulty.enum';

import { type CellInterface } from './cell.interface';
import { type FieldInterface } from './field.interface';

/**
 * General game state, used for logic and persisting
 */
export interface GameInterface {
    difficulty: DifficultyEnum;
    score: number;
    mistakes: number;
    startedAt: Date;
    completionPercent: number;
    filledField: FieldInterface;
    gameField: FieldInterface;
    selectedCell?: CellInterface;
    selectedValue?: number;
}

export const emptyGame: GameInterface = {
    difficulty: DifficultyEnum.Newbie,
    startedAt: InitialDateConstant,
    completionPercent: 0,
    filledField: [],
    gameField: [],
    mistakes: 0,
    score: 0
};
