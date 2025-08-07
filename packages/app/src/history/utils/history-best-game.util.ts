import type { GameState } from '../../game/store/game.state';

export const historyBestGame = (history: GameState): [number, number] =>
    Object.values(history.historyByDifficulty).reduce(
        (max, gameHistory) => (gameHistory.bestScore > max[0] ? [gameHistory.bestScore, gameHistory.bestTime] : max),
        [0, 0]
    );
