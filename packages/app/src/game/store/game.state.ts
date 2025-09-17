import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';
import { solutionStepsParse, solutionStepsStringify } from '../interface/solution-step.interface';

import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { SolutionStepInterface } from '../interface/solution-step.interface';

export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    maxMistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    isFinished: boolean;
    hasCandidates: boolean;
    solutionSteps: SolutionStepInterface[];
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export type SerializedGameState = Partial<Record<keyof Omit<GameState, 'sudokuString'>, string>> & Pick<GameState, 'sudokuString'>;
export type SharableGameState = Omit<GameState, 'isPaused' | 'isFinished' | 'hasCandidates' | 'historyByDifficulty'>;

export const initialGameState: GameState = {
    isFinished: false,
    isPaused: false,
    elapsedTime: 0,
    sudokuString: '',
    mistakes: 0,
    maxMistakes: 3,
    score: 0,
    hasCandidates: false,
    historyByDifficulty: {
        [DifficultyEnum.Newbie]: { ...emptyGameHistory, difficulty: DifficultyEnum.Newbie },
        [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy },
        [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium },
        [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard },
        [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare }
    },
    solutionSteps: []
};

export const gameStateToUrl = (gameState: GameState): string => {
    const { isFinished, isPaused, hasCandidates, solutionSteps, historyByDifficulty, ...persistedParams } = gameState;

    return btoa(JSON.stringify({ ...persistedParams, solutionSteps: solutionStepsStringify(solutionSteps) }));
};

export const urlToGameState = (gameStateString: string): SharableGameState => {
    const input = JSON.parse(atob(gameStateString)) as SerializedGameState;

    return {
        sudokuString: input.sudokuString,
        score: parseInt(input.score ?? '0', 10),
        mistakes: parseInt(input.mistakes ?? '0', 10),
        maxMistakes: parseInt(input.maxMistakes ?? '0', 10),
        elapsedTime: parseInt(input.elapsedTime ?? '0', 10),
        solutionSteps: solutionStepsParse(input.solutionSteps)
    };
};
