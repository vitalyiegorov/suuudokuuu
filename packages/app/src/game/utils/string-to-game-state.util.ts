import { GameStateSerializer } from '@suuudokuuu/encoder';

import { GameState, initialGameState } from '../store/game.state';

const serializer = new GameStateSerializer();

export const stringToGameState = (gameStateString = ''): GameState => {
    try {
        const [sudokuString, challengeSteps, maxMistakes, isChallenge, challengeTime] = serializer.decode(gameStateString);

        return {
            ...initialGameState,
            sudokuString,
            maxMistakes,

            ...(isChallenge && {
                challengeSteps,
                challengeTime,
                challengeState: gameStateString
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
