import type { GameState } from '../store/game.state';
import type { DifficultyEnum, Sudoku } from '@suuudokuuu/generator';

export interface GameContextValueInterface {
    readonly create: (difficulty: DifficultyEnum, maxMistakes: number, isChallengeRun?: boolean) => void;
    readonly createFromState: (newState: GameState) => void;
    readonly isCreatingGame: boolean;
    readonly sudoku: Sudoku;
}
