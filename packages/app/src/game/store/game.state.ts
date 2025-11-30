import { DifficultyEnum } from '@suuudokuuu/generator';

import { Solution } from '../../history/classes/solution';
import { SudokuStringEncoder } from '../../history/classes/sudoku-string-encoder';
import { emptyGameHistory } from '../../history/interfaces/history-game.interface';

import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { SolutionStepInterface } from '../../history/interfaces/solution-step.interface';

export type InputMode = 'normal' | 'candidate';

export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    maxMistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    showAutoCandidates: boolean;
    inputMode: InputMode;
    candidates: Record<string, number[]>;
    solutionSteps: SolutionStepInterface[];
    historyByDifficulty: Record<DifficultyEnum, HistoryGameInterface>;
}

export interface SerializedGameState {
    s: string;
    h?: string;
    m?: string;
}

export const initialGameState: GameState = {
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
        [DifficultyEnum.Nightmare]: { ...emptyGameHistory, difficulty: DifficultyEnum.Nightmare }
    },
    solutionSteps: []
};

export const gameStateToUrl = (gameState: GameState): string => {
    const sudokuEncoder = new SudokuStringEncoder();
    const serializedState = {
        s: sudokuEncoder.encode(gameState.sudokuString, gameState.solutionSteps),
        h: Solution.fromSteps(gameState.solutionSteps).stringify(),
        m: gameState.maxMistakes.toString()
    } satisfies SerializedGameState;

    return btoa(JSON.stringify(serializedState));
};

export const urlToGameState = (gameStateString: string): GameState => {
    const input = JSON.parse(atob(gameStateString)) as SerializedGameState;
    const sudokuEncoder = new SudokuStringEncoder();

    return {
        ...initialGameState,
        sudokuString: sudokuEncoder.decode(input.s),
        maxMistakes: parseInt(input.m ?? '0', 10),
        solutionSteps: Solution.fromString(input.h ?? '').getSteps()
    };
};
