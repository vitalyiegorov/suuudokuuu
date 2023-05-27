import { emptyGame, type GameInterface } from '../../interfaces/game.interface';
import { type AppRootState } from '../../store/app-root/app-root.state';

export const resetGameState = (gameState: GameInterface): AppRootState => ({
    ...gameState,
    ...emptyGame
});
