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
    challengeSteps: SolutionStepInterface[];
    challengeTime: number;
    challengeState: string;
}

export interface SerializedGameState {
    s: string;
    h?: string;
    m?: string;
    c?: string;
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
    solutionSteps: [],
    challengeSteps: [],
    challengeTime: 0,
    challengeState: ''
};

export const gameStateToUrl = (gameState: GameState, isChallenge = false): string => {
    const sudokuEncoder = new SudokuStringEncoder();

    const serializedState = {
        s: sudokuEncoder.encode(gameState.sudokuString, gameState.solutionSteps),
        h: Solution.fromSteps(gameState.solutionSteps).stringify(),
        m: gameState.maxMistakes.toString(),
        c: isChallenge ? '1' : '0'
    } satisfies SerializedGameState;

    return btoa(JSON.stringify(serializedState));
};

export const urlToGameState = (gameStateString: string): GameState => {
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
