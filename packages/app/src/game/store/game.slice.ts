import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { solutionStepFromCell } from '../interface/solution-step.interface';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { CellInterface, DifficultyEnum, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<Pick<GameState, 'sudokuString' | 'maxMistakes'>>) => {
            Object.assign(state, { ...initialGameState, historyByDifficulty: state.historyByDifficulty });

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
            Object.assign(state, { ...initialGameState, historyByDifficulty: state.historyByDifficulty });
        },
        toggleCandidates: state => {
            state.hasCandidates = !state.hasCandidates;
        },
        // eslint-disable-next-line max-statements
        finish: (state, action: PayloadAction<{ difficulty: DifficultyEnum; isWon: boolean }>) => {
            const { difficulty, isWon } = action.payload;

            const history = state.historyByDifficulty[difficulty];

            history.gamesCompleted += 1;
            history.averageTime = (history.averageTime * history.gamesCompleted + state.elapsedTime) / history.gamesCompleted;

            if (isWon) {
                history.gamesWon += 1;

                if (state.mistakes === 0) {
                    history.gamesWonWithoutMistakes += 1;
                }

                if (state.maxMistakes === 0) {
                    history.hardcoreWon += 1;
                }

                if (state.score > history.bestScore) {
                    history.bestScore = state.score;
                    history.bestTime = state.elapsedTime;
                }
            } else {
                history.gamesLost += 1;
            }
        }
    }
});
