// TODO: Cannot use barrel =) metro will collapse with `TypeError: Cannot read property 'actions' of undefined, js engine: hermes`
import { InitialDateConstant } from '../../@generic/constants/date.constant';
import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';

export interface GameState {
    difficulty: DifficultyEnum;
    sudokuString: string;
    score: number;
    mistakes: number;
    startedAt: Date;
    endedAt: Date;
}

export const initialGameState: GameState = {
    difficulty: DifficultyEnum.Newbie,
    sudokuString: '',
    endedAt: InitialDateConstant,
    mistakes: 0,
    score: 0,
    startedAt: InitialDateConstant
};
