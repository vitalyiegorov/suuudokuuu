import { Solution, SudokuStringEncoder } from '@suuudokuuu/encoder';
import { compressToEncodedURIComponent } from 'lz-string';

import { SerializedGameState } from '../interfaces/serialized-game-state.interface';
import { GameState } from '../store/game.state';

export const gameStateToString = (gameState: GameState, isChallenge = false): string => {
    const sudokuEncoder = new SudokuStringEncoder();

    const serializedState = {
        s: sudokuEncoder.encode(gameState.sudokuString, gameState.solutionSteps),
        h: Solution.fromSteps(gameState.solutionSteps).stringify(),
        m: gameState.maxMistakes.toString(),
        c: isChallenge ? '1' : '0'
    } satisfies SerializedGameState;

    return compressToEncodedURIComponent(JSON.stringify(serializedState));
};
