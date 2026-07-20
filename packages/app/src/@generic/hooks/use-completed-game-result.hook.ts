import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { getDifficultyText } from '../utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../utils/get-mistakes-type-text.util';

import { useResetGame } from './use-reset-game.hook';
import { useTimerText } from './use-timer-text.hook';

import type { GameState } from '../../game/store/game.state';

interface CompletedGameResultRedirect {
    readonly kind: 'redirect';
}

interface CompletedGameResultReady {
    readonly difficultyText: string;
    readonly gameState: GameState;
    readonly kind: 'ready';
    readonly mistakesTypeText: string;
    readonly sudoku: Sudoku;
    readonly timeText: string;
}

type CompletedGameResult = CompletedGameResultReady | CompletedGameResultRedirect;

export const useCompletedGameResult = (): CompletedGameResult => {
    const [isGameStarted, gameState] = useResetGame();
    const timeText = useTimerText(gameState.elapsedTime);

    if (!isGameStarted && gameState.elapsedTime === 0) {
        return { kind: 'redirect' };
    }

    try {
        const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);
        const difficultyText = getDifficultyText(sudoku.Difficulty);
        const mistakesTypeText = getMistakesTypeText(gameState.maxMistakes);

        return { difficultyText, gameState, kind: 'ready', mistakesTypeText, sudoku, timeText };
    } catch {
        return { kind: 'redirect' };
    }
};
