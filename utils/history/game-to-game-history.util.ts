import { MaxMistakesConstant } from '../../constants/max-mistakes.constant';
import { type GameHistoryInterface } from '../../interfaces/game-history.interface';
import { type GameInterface } from '../../interfaces/game.interface';
import { gameDuration } from '../game/game-duration.util';
import { isDurationLower } from '../is-duration.lower';

export const gameToGameHistory = (game: GameInterface, current: GameHistoryInterface): GameHistoryInterface => {
    const duration = gameDuration(game);

    return {
        difficulty: game.difficulty,
        bestScore: current.bestScore > game.score ? current.bestScore : game.score,
        bestTime: isDurationLower(duration, current.bestTime) ? duration : current.bestTime,
        gamesCompleted: current.gamesCompleted + 1,
        gamesLost: game.mistakes >= MaxMistakesConstant ? current.gamesLost + 1 : current.gamesLost,
        gamesWon: game.mistakes === 0 ? current.gamesWon + 1 : current.gamesWon
    };
};
