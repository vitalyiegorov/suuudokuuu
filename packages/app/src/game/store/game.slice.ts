import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { emptyGameHistory } from '../../history/interfaces/history-game.interface';
import { solutionStepFromCell } from '../interface/solution-step.interface';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { CellInterface, DifficultyEnum, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<Pick<GameState, 'sudokuString' | 'maxMistakes'>>) => {
            Object.assign(state, initialGameState);

            state.sudokuString = action.payload.sudokuString;
            state.maxMistakes = action.payload.maxMistakes;
        },
        pause: state => {
            state.isPaused = true;
        },
        resume: state => {
            state.isPaused = false;
        },
        save: (state, action: PayloadAction<{ sudoku: Sudoku; correctCell: CellInterface; scoredCells: ScoredCellsInterface }>) => {
            state.sudokuString = action.payload.sudoku.toString();
            state.score += action.payload.sudoku.getScore(action.payload.scoredCells, state.elapsedTime, state.mistakes);
            state.solutionSteps.push(solutionStepFromCell(action.payload.correctCell, state.elapsedTime));
        },
        mistake: state => {
            state.mistakes += 1;
        },
        load: (state, action: PayloadAction<Partial<GameState>>) => {
            Object.assign(state, action.payload);
        },
        tick: state => {
            state.elapsedTime += 1;
        },
        reset: state => {
            Object.assign(state, initialGameState);
        },
        toggleCandidates: state => {
            state.hasCandidates = !state.hasCandidates;
        },
        finish: (state, action: PayloadAction<{ difficulty: DifficultyEnum; isWon: boolean }>) => {
            const current = { ...emptyGameHistory, ...state.historyByDifficulty[action.payload.difficulty] };

            state.historyByDifficulty[action.payload.difficulty] = {
                ...current,
                gamesCompleted: current.gamesCompleted + 1,
                averageTime: (current.averageTime * current.gamesCompleted + state.elapsedTime) / (current.gamesCompleted + 1),

                ...(action.payload.isWon && {
                    gamesWon: current.gamesWon + 1,
                    gamesWonWithoutMistakes: state.mistakes === 0 ? current.gamesWonWithoutMistakes + 1 : current.gamesWonWithoutMistakes,
                    hardcoreWon: state.maxMistakes === 0 ? current.hardcoreWon + 1 : current.hardcoreWon,

                    ...(state.score > current.bestScore && {
                        bestScore: state.score,
                        bestTime: state.elapsedTime
                    })
                }),

                ...(!action.payload.isWon && {
                    gamesLost: current.gamesLost + 1
                })
            };
        }
    }
});
