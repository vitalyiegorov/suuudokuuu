// TODO: Cannot use barrel =) metro will collapse with `TypeError: Cannot read property 'actions' of undefined, js engine: hermes`
import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

// ts-prune-ignore-next
export interface GameState {
    difficulty: DifficultyEnum;
    sudokuString: string;
    score: number;
    mistakes: number;
    elapsedTime: number;
    paused: boolean;
}

export const initialGameState: GameState = {
    paused: false,
    elapsedTime: 0,
    difficulty: DifficultyEnum.Newbie,
    sudokuString: '',
    mistakes: 0,
    score: 0
};
