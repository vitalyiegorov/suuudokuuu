import { Solution, SudokuStringEncoder } from '@suuudokuuu/encoder';
import { decompressFromEncodedURIComponent } from 'lz-string';

import { GameState, initialGameState } from '../store/game.state';

export const stringToGameState = (gameStateString = ''): GameState => {
    try {
        const [field, steps, maxMistakes, isChallenge] = decompressFromEncodedURIComponent(gameStateString).split('|');

        const sudokuEncoder = new SudokuStringEncoder();
        const solution = Solution.fromString(steps);
        const solutionSteps = solution.getSteps();

        return {
            ...initialGameState,
            sudokuString: sudokuEncoder.decode(field),
            maxMistakes: parseInt(maxMistakes, 10) || 0,
            solutionSteps,

            ...(isChallenge === '1' && {
                challengeState: gameStateString,
                challengeSteps: solutionSteps,
                challengeTime: solution.getElapsedTime()
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
