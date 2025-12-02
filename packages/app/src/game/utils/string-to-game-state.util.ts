import { Solution, SudokuStringEncoder } from '@suuudokuuu/encoder';

import { SerializedGameState } from '../interfaces/serialized-game-state.interface';
import { GameState, initialGameState } from '../store/game.state';

export const stringToGameState = (gameStateString: string): GameState => {
    try {
        const input = JSON.parse(atob(gameStateString)) as SerializedGameState;

        const sudokuEncoder = new SudokuStringEncoder();
        const solution = Solution.fromString(input.h ?? '');

        return {
            ...initialGameState,
            sudokuString: sudokuEncoder.decode(input.s),
            maxMistakes: parseInt(input.m ?? '0', 10),

            ...(input.c === '1' && {
                challengeState: gameStateString,
                challengeSteps: solution.getSteps(),
                challengeTime: solution.getElapsedTime()
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
