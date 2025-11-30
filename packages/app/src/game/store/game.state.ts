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

const calculateTotalTimeFromSteps = (steps: SolutionStepInterface[]): number => steps.reduce((total, step) => total + step.ts, 0);

export const urlToGameState = (gameStateString: string): GameState => {
    try {
        const input = JSON.parse(atob(gameStateString)) as SerializedGameState;

        const sudokuEncoder = new SudokuStringEncoder();
        const opponentSteps = Solution.fromString(input.h ?? '').getSteps();

        return {
            ...initialGameState,
            sudokuString: sudokuEncoder.decode(input.s),
            maxMistakes: parseInt(input.m ?? '0', 10),

            ...(input.c === '1' && {
                isChallengeMode: true,
                opponentSteps,
                opponentTotalTime: calculateTotalTimeFromSteps(opponentSteps)
            })
        };
    } catch {
        return initialGameState;
    }
};

// suuudokuuu://shared?eyJzIjoiQUNCY0V3UWdxaG9FU0pNVW91Umdqb0hzUUlpNUlpY0ZFS3NXY3ZKZ1RLbWpOb2NFN0I5VURvWlJHalpJNlUweXAwVVNwWlVTdUZncldYU3hOa0xOR2p0b2JvNGR6THBuWnZGZWkrSi9NQW9Kd2xoakVTSzhlSkN5V2x2TWlhVTQ1OGc9IiwiaCI6IkJtQXBQRUFyR29Bc2xDQXRYa0F2WVFBd2pNQXhvSUF5RG9BMGFxQTIiLCJtIjoiMyIsImMiOiIxIn0=
