import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
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
        // eslint-disable-next-line max-statements
        save: (state, action: PayloadAction<{ sudoku: Sudoku; correctCell: CellInterface; scoredCells: ScoredCellsInterface }>) => {
            const { sudoku, correctCell, scoredCells } = action.payload;
            const { x, y, value } = correctCell;
            
            state.sudokuString = sudoku.toString();
            state.score += sudoku.getScore(scoredCells, state.elapsedTime, state.mistakes);
            state.solutionSteps.push(solutionStepFromCell(correctCell, state.elapsedTime));
            
            // Clear candidates from the filled cell
            state.candidates[getCellKey(correctCell)] = [];
            
            /*
             * Clear the filled value from all related cells' manual candidates
             * Use sudoku's Field to efficiently get field dimensions
             */
            const fieldSize = sudoku.Field.length;
            // Standard Sudoku box size
            const boxSize = 3;
            const boxX = Math.floor(x / boxSize) * boxSize;
            const boxY = Math.floor(y / boxSize) * boxSize;
            
            for (let i = 0; i < fieldSize; i += 1) {
                // Clear from same row
                const rowKey = `${i}-${y}`;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (state.candidates[rowKey]?.includes(value)) {
                    const filtered = state.candidates[rowKey].filter(candidate => candidate !== value);
                    if (filtered.length === 0) {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete state.candidates[rowKey];
                    } else {
                        state.candidates[rowKey] = filtered;
                    }
                }
                
                // Clear from same column
                const colKey = `${x}-${i}`;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (state.candidates[colKey]?.includes(value)) {
                    const filtered = state.candidates[colKey].filter(candidate => candidate !== value);
                    if (filtered.length === 0) {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete state.candidates[colKey];
                    } else {
                        state.candidates[colKey] = filtered;
                    }
                }
            }
            
            // Clear from same box
            for (let by = boxY; by < boxY + boxSize; by += 1) {
                for (let bx = boxX; bx < boxX + boxSize; bx += 1) {
                    const boxKey = `${bx}-${by}`;
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (state.candidates[boxKey]?.includes(value)) {
                        const filtered = state.candidates[boxKey].filter(candidate => candidate !== value);
                        if (filtered.length === 0) {
                            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                            delete state.candidates[boxKey];
                        } else {
                            state.candidates[boxKey] = filtered;
                        }
                    }
                }
            }
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
        toggleShowAutoCandidates: state => {
            state.showAutoCandidates = !state.showAutoCandidates;

            if (state.showAutoCandidates) {
                state.inputMode = 'normal';
            }
        },
        toggleInputMode: state => {
            const newMode = state.inputMode === 'normal' ? 'candidate' : 'normal';
            state.inputMode = newMode;

            if (newMode === 'candidate') {
                state.showAutoCandidates = false;
            }
        },
        toggleCellCandidate: (state, action: PayloadAction<CellInterface>) => {
            const { value } = action.payload;

            const key = getCellKey(action.payload);
            const candidates = state.candidates[key] ?? [];

            if (candidates.includes(value)) {
                state.candidates[key] = candidates.filter(val => val !== value);
            } else {
                state.candidates[key] = [...candidates, value];
            }
        },
        clearCellCandidates: (state, action: PayloadAction<CellInterface>) => {
            state.candidates[getCellKey(action.payload)] = [];
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
