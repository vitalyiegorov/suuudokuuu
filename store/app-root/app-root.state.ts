import { type CellInterface } from '../../interfaces/cell.interface';

export interface AppRootState {
    filledField: CellInterface[][];
    gameField: CellInterface[][];
    selectedCell?: CellInterface;
    selectedValue?: number;
    mistakes: number;
}

export const appRootInitialState: AppRootState = {
    filledField: [],
    gameField: [],
    mistakes: 0
};
