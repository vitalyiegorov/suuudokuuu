import { DifficultyEnum } from '@suuudokuuu/generator';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';

import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';

export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    maxMistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    shouldShowPauseScreen: boolean;
    shouldResumeOnFocus: boolean;
    showAutoCandidates: boolean;
    inputMode: 'normal' | 'candidate';
    candidates: Record<string, number[]>;
    solutionSteps: SolutionStepInterface[];
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
    challengeSteps: SolutionStepInterface[];
    challengeTime: number;
    challengeState: string;
}

export const initialGameState: GameState = {
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: false,
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
        [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare }
    },
    solutionSteps: [],
    challengeSteps: [],
    challengeTime: 0,
    challengeState: ''
};
