import { type AvailableValuesType } from '../types/available-values.type';

import { type FieldInterface } from './field.interface';

export interface SudokuState {
    availableValues: AvailableValuesType;
    // TODO: Do we really need both in the state?
    possibleValues: number[];
    elapsedSeconds: number;
    mistakes: number;
    score: number;
    maxMistakes: number;
    // TODO: Do we need it?
    emptyCells: number;
    field: FieldInterface;
    gameField: FieldInterface;
}
