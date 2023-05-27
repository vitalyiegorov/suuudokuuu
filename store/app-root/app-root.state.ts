import { emptyGame, type GameInterface } from '../../interfaces/game.interface';

// TODO: Extract game to separate state
export interface AppRootState extends GameInterface {}

export const appRootInitialState: AppRootState = {
    ...emptyGame
};
