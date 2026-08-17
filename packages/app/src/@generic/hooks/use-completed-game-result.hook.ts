import { useLingui } from '@lingui/react/macro';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { getDifficultyMessage } from '../utils/get-difficulty-message.util';
import { getMistakesTypeText } from '../utils/get-mistakes-type-text.util';

import { useResetGame } from './use-reset-game.hook';
import { useTimerText } from './use-timer-text.hook';

import type { GameSetupInterface } from '../../game/interface/game-setup.interface';
import type { GameState } from '../../game/store/game.state';

interface CompletedGameResultRedirect {
    readonly kind: 'redirect';
}

interface CompletedGameResultReady {
    readonly difficultyText: string;
    readonly gameState: GameState;
    readonly kind: 'ready';
    readonly mistakesTypeText: string;
    readonly retrySetup: GameSetupInterface;
    readonly sudoku: Sudoku;
    readonly timeText: string;
}

type CompletedGameResult = CompletedGameResultReady | CompletedGameResultRedirect;

export const useCompletedGameResult = (): CompletedGameResult => {
    const { t } = useLingui();
    const [isGameStarted, gameState] = useResetGame();
    const timeText = useTimerText(gameState.elapsedTime);

    if (!isGameStarted && gameState.elapsedTime === 0) {
        return { kind: 'redirect' };
    }

    try {
        const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);
        const retrySetup: GameSetupInterface = {
            difficulty: gameState.difficulty,
            isChallengeRun: gameState.isChallengeRun,
            maxMistakes: gameState.maxMistakes
        };
        const difficultyText = t(getDifficultyMessage(retrySetup.difficulty));
        const mistakesTypeText = t(getMistakesTypeText(retrySetup.maxMistakes));

        return { difficultyText, gameState, kind: 'ready', mistakesTypeText, retrySetup, sudoku, timeText };
    } catch {
        return { kind: 'redirect' };
    }
};
