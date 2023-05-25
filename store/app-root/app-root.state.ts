import { emptyGameState, type GameStateInterface } from '../../interfaces/game-state.interface';

export interface AppRootState extends GameStateInterface {}

export const appRootInitialState: AppRootState = {
    ...emptyGameState
};
