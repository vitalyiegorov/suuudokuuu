import { Solution, SudokuStringEncoder } from '@suuudokuuu/encoder';
import { compressToEncodedURIComponent } from 'lz-string';

import { GameState } from '../store/game.state';

export const gameStateToString = (gameState: GameState, isChallenge = false): string => {
    const sudokuEncoder = new SudokuStringEncoder();

    const packed = [
        sudokuEncoder.encode(gameState.sudokuString, gameState.solutionSteps),
        Solution.fromSteps(gameState.solutionSteps).stringify(),
        gameState.maxMistakes,
        isChallenge ? 1 : 0
    ].join('|');

    return compressToEncodedURIComponent(packed);
};
