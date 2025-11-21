import { DifficultyEnum } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';
import { solutionStepsParse, solutionStepsStringify } from '../interface/solution-step.interface';

import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { SolutionStepInterface } from '../interface/solution-step.interface';

export type InputMode = 'normal' | 'candidate';

export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    maxMistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    isFinished: boolean;
    showAutoCandidates: boolean;
    inputMode: InputMode;
    candidates: Record<string, number[]>;
    solutionSteps: SolutionStepInterface[];
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    hellPuzzles: string[];
}

export type SerializedGameState = Partial<Record<keyof Omit<GameState, 'sudokuString' | 'candidates'>, string>> &
    Pick<GameState, 'sudokuString' | 'candidates'>;
export type SharableGameState = Omit<GameState, 'isPaused' | 'isFinished' | 'showAutoCandidates' | 'inputMode' | 'historyByDifficulty' | 'hellPuzzles'>;

export const initialGameState: GameState = {
    isFinished: false,
    isPaused: false,
    elapsedTime: 0,
    sudokuString: '',
    mistakes: 0,
    maxMistakes: 3,
    score: 0,
    showAutoCandidates: false,
    inputMode: 'normal',
    candidates: {},
    historyByDifficulty: {
        [DifficultyEnum.Newbie]: { ...emptyGameHistory, difficulty: DifficultyEnum.Newbie },
        [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy },
        [DifficultyEnum.Medium]: { ...emptyGameHistory, difficulty: DifficultyEnum.Medium },
        [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard },
        [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare },
        [DifficultyEnum.Hell]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hell }
    },
    solutionSteps: [],
    hellPuzzles: []
};

export const gameStateToUrl = (gameState: GameState): string => {
    const { isFinished, isPaused, showAutoCandidates, inputMode, solutionSteps, historyByDifficulty, ...persistedParams } = gameState;

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
        solutionSteps: solutionStepsParse(input.solutionSteps),
        candidates: isDefined(input.candidates) ? input.candidates : {}
    };
};
