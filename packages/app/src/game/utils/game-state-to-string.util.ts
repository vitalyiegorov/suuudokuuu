import { GameStateSerializer } from '@suuudokuuu/encoder';

import { GameState } from '../store/game.state';

const serializer = new GameStateSerializer();

export const gameStateToString = (gameState: GameState, isChallenge = false): string => {
    try {
        const { sudokuString, solutionSteps, maxMistakes } = gameState;

        return serializer.encode(sudokuString, solutionSteps, maxMistakes, isChallenge);
    } catch {
        return '';
    }
};
