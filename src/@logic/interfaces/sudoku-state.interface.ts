import { DifficultyEnum } from '../../@generic';
import { type AvailableValuesType } from '../types/available-values.type';

import { type CellInterface } from './cell.interface';
import { type FieldInterface } from './field.interface';
import { type ScoredCellsInterface, emptyScoredCells } from './scored-cells.interface';

export enum SudokuMoveEnum {
    Start = 'Start',
    Correct = 'Correct',
    Mistake = 'Mistake',
    Lost = 'Lost',
    Won = 'Won'
}

export interface SudokuState {
    difficulty: DifficultyEnum;
    scoredCells: ScoredCellsInterface;
    availableValues: AvailableValuesType;
    elapsedSeconds: number;
    mistakes: number;
    score: number;
    maxMistakes: number;
    // TODO: Do we need it?
    emptyCells: number;
    fullField: FieldInterface;
    gameField: FieldInterface;
    move: SudokuMoveEnum;
    cell?: CellInterface;
}

export const initialSudokuState: SudokuState = {
    difficulty: DifficultyEnum.Newbie,
    scoredCells: emptyScoredCells,
    availableValues: {},
    elapsedSeconds: 0,
    mistakes: 0,
    score: 0,
    maxMistakes: 0,
    emptyCells: 0,
    fullField: [],
    gameField: [],
    move: SudokuMoveEnum.Start
};
