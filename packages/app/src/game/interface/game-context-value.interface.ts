import type { GameSetupInterface } from './game-setup.interface';
import type { GameState } from '../store/game.state';
import type { Sudoku } from '@suuudokuuu/generator';

export interface GameContextValueInterface {
    readonly create: (setup: GameSetupInterface) => void;
    readonly createFromState: (newState: GameState) => void;
    readonly sudoku: Sudoku;
}
