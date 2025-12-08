import { GameStateSerializer, Solution } from '@suuudokuuu/encoder';

import { GameState, initialGameState } from '../store/game.state';

const serializer = new GameStateSerializer();

export const stringToGameState = (gameStateString = ''): GameState => {
    try {
        const [sudokuString, challengeSteps, maxMistakes, isChallenge] = serializer.decode(gameStateString);

        const solution = Solution.fromSteps(challengeSteps);

        return {
            ...initialGameState,
            sudokuString,
            maxMistakes,

            ...(isChallenge && {
                challengeSteps,
                challengeState: gameStateString,
                challengeTime: solution.getElapsedTime()
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
