import { DifficultyEnum, InitialDateConstant } from '../../@generic';
import { type CellInterface, type ScoredCellsInterface } from '../../@logic';

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
    selectedCell: undefined,
    difficulty: DifficultyEnum.Newbie,
    startedAt: InitialDateConstant,
    endedAt: InitialDateConstant,
    mistakes: 0,
    score: 0,
    scoredCells: undefined
};
