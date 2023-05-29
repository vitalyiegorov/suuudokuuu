import { DifficultyEnum, InitialDateConstant } from '../../@generic';
import { type CellInterface, emptyScoredCells, type FieldInterface, type ScoredCellsInterface } from '../../@logic';
import { type AvailableValues } from '../../@logic/types/available-values.type';

export interface GameState {
    difficulty: DifficultyEnum;
    field: FieldInterface;
    fullField: FieldInterface;
    possibleValues: number[];
    availableValues: AvailableValues;
    score: number;
    mistakes: number;
    startedAt: Date;
    endedAt: Date;
    selectedCell?: CellInterface;
    scoredCells: ScoredCellsInterface;
}

export const initialGameState: GameState = {
    fullField: [],
    difficulty: DifficultyEnum.Newbie,
    availableValues: [],
    possibleValues: [],
    field: [],
    endedAt: InitialDateConstant,
    mistakes: 0,
    score: 0,
    startedAt: InitialDateConstant,
    scoredCells: emptyScoredCells
};
