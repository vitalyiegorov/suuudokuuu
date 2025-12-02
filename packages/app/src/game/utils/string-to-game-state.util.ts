import { Solution, SudokuStringEncoder } from '@suuudokuuu/encoder';
import { decompressFromEncodedURIComponent } from 'lz-string';

import { GameState, initialGameState } from '../store/game.state';

export const stringToGameState = (gameStateString: string): GameState => {
    try {
        const [field, steps, maxMistakes, isChallenge] = decompressFromEncodedURIComponent(gameStateString).split('|');

        const sudokuEncoder = new SudokuStringEncoder();
        const solution = Solution.fromString(steps);

        return {
            ...initialGameState,
            sudokuString: sudokuEncoder.decode(field),
            maxMistakes: parseInt(maxMistakes, 10) || 0,

            ...(isChallenge === '1' && {
                challengeState: gameStateString,
                challengeSteps: solution.getSteps(),
                challengeTime: solution.getElapsedTime()
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
