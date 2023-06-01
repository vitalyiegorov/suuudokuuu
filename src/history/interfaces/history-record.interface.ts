import { type DifficultyEnum } from '../../@generic';
import { type GameState } from '../../game/store/game.state';

export interface HistoryRecordInterface extends Pick<GameState, 'elapsedTime' | 'score'> {
    isWon: boolean;
    difficulty: DifficultyEnum;
}
