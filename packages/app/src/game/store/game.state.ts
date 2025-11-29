import { DifficultyEnum, defaultSudokuConfig } from '@suuudokuuu/generator';

import { Solution } from '../../history/classes/solution';
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
    isChallengeMode: boolean;
    opponentSteps: SolutionStepInterface[];
    opponentTotalTime: number;
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
    isChallengeMode: false,
    opponentSteps: [],
    opponentTotalTime: 0
};

export const gameStateToUrl = (gameState: GameState): string => {
    const serializedState = {
        s: gameState.sudokuString,
        h: Solution.fromSteps(gameState.solutionSteps).stringify(),
        m: gameState.maxMistakes.toString()
    } satisfies SerializedGameState;

    return btoa(JSON.stringify(serializedState));
};

export const clearSolutionStepsFromSudokuString = (sudokuString: string, steps: SolutionStepInterface[]): string => {
    const chars = sudokuString.split('');
    const gridSize = defaultSudokuConfig.fieldSize;

    for (const step of steps) {
        const index = step.y * gridSize + step.x;
        chars[index] = '.';
    }

    return chars.join('');
};

export const calculateTotalTimeFromSteps = (steps: SolutionStepInterface[]): number => steps.reduce((total, step) => total + step.ts, 0);

export const gameStateToChallengeUrl = (gameState: GameState): string => {
    const cleanedSudokuString = clearSolutionStepsFromSudokuString(gameState.sudokuString, gameState.solutionSteps);
    const serializedState = {
        s: cleanedSudokuString,
        h: Solution.fromSteps(gameState.solutionSteps).stringify(),
        m: gameState.maxMistakes.toString(),
        c: '1'
    } satisfies SerializedGameState;

    return btoa(JSON.stringify(serializedState));
};

export const urlToGameState = (gameStateString: string): GameState => {
    const input = JSON.parse(atob(gameStateString)) as SerializedGameState;
    const isChallenge = input.c === '1';
    const opponentSteps = Solution.fromString(input.h ?? '').getSteps();

    return {
        ...initialGameState,
        sudokuString: input.s,
        maxMistakes: parseInt(input.m ?? '0', 10),
        solutionSteps: isChallenge ? [] : opponentSteps,
        isChallengeMode: isChallenge,
        opponentSteps: isChallenge ? opponentSteps : [],
        opponentTotalTime: isChallenge ? calculateTotalTimeFromSteps(opponentSteps) : 0
    };
};
