import { intervalToDuration } from 'date-fns';

import { isDurationLower } from '../../@generic';
import { type GameInterface } from '../../game/interfaces/game.interface';
import { type GameHistoryInterface } from '../interfaces/game-history.interface';

const gameDuration = (game: GameInterface): Duration =>
    intervalToDuration({ start: new Date(game.endedAt), end: new Date(game.startedAt) });

export const gameToGameHistory = (game: GameInterface, current: GameHistoryInterface): GameHistoryInterface => {
    const duration = gameDuration(game);

    return {
        difficulty: game.difficulty,
        bestScore: current.bestScore > game.score ? current.bestScore : game.score,
        bestTime: isDurationLower(duration, current.bestTime) ? duration : current.bestTime,
        gamesCompleted: current.gamesCompleted + 1,
        gamesLost: game.isLost ? current.gamesLost + 1 : current.gamesLost,
        gamesWon: game.mistakes === 0 ? current.gamesWon + 1 : current.gamesWon
    };
};
