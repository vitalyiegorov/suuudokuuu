import { decodeSharedGameState } from './decode-shared-game-state.util';

export const stringToGameState = (gameStateString = '') => decodeSharedGameState(gameStateString).gameState;
