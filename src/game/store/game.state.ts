import { emptyGame, type GameInterface } from '../interfaces/game.interface';

export interface GameState extends GameInterface {}

export const gameInitialState: GameState = {
    ...emptyGame
};
