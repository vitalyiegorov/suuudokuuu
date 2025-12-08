import { GameStateSerializer } from '@suuudokuuu/encoder';

import { GameState } from '../store/game.state';

const serializer = new GameStateSerializer();

export const gameStateToString = (gameState: GameState, isChallenge = false): string =>
    serializer.encode(gameState.sudokuString, gameState.solutionSteps, gameState.maxMistakes, isChallenge);
