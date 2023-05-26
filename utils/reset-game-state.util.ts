import { emptyGameState, type GameStateInterface } from '../interfaces/game-state.interface';
import { type AppRootState } from '../store/app-root/app-root.state';

export const resetGameState = (gameState: GameStateInterface): AppRootState => ({
    ...gameState,
    ...emptyGameState
});
