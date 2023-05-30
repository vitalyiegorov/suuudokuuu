import { intervalToDuration } from 'date-fns';

import type { GameInterface } from '../../game';
import type { GameHistoryInterface } from '../interfaces/game-history.interface';

const gameDuration = (game: GameInterface): Duration =>
    intervalToDuration({ start: new Date(game.endedAt), end: new Date(game.startedAt) });

export const gameToGameHistory = (game: GameInterface, current: GameHistoryInterface): GameHistoryInterface => {
    const duration = gameDuration(game);

    const isBestScore = game.score > current.bestScore;

    return {
        bestScore: isBestScore ? game.score : current.bestScore,
        bestTime: isBestScore ? duration : current.bestTime,
        difficulty: game.difficulty,
        gamesCompleted: current.gamesCompleted + 1,
        gamesLost: game.isLost ? current.gamesLost + 1 : current.gamesLost,
        gamesWon: game.mistakes === 0 ? current.gamesWon + 1 : current.gamesWon
    };
};
