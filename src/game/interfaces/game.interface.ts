import { InitialDateConstant, DifficultyEnum } from '../../@generic';

import { type CellInterface } from './cell.interface';
import { type FieldInterface } from './field.interface';
import { type ScoredCellsInterface } from './scored-cells.interface';

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
    scoredCells?: ScoredCellsInterface;
    availableValues: number[];
}

export const emptyGame: GameInterface = {
    isLost: false,
    availableValues: [],
    selectedCell: undefined,
    difficulty: DifficultyEnum.Newbie,
    startedAt: InitialDateConstant,
    endedAt: InitialDateConstant,
    completionPercent: 0,
    filledField: [],
    gameField: [],
    mistakes: 0,
    score: 0,
    scoredCells: undefined
};
