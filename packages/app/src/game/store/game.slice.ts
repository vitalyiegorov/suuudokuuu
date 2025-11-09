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
        // eslint-disable-next-line max-statements, no-continue
        clearRelatedCandidates: (state, action: PayloadAction<CellInterface>) => {
            const { x, y, value } = action.payload;
            
            // Calculate box coordinates
            const boxX = Math.floor(x / 3) * 3;
            const boxY = Math.floor(y / 3) * 3;
            
            // Iterate through all possible cells (9x9 grid)
            for (let row = 0; row < 9; row += 1) {
                for (let col = 0; col < 9; col += 1) {
                    // Check if cell is in same row, column, or box
                    const isSameRow = row === y;
                    const isSameCol = col === x;
                    const isSameBox = col >= boxX && col < boxX + 3 && row >= boxY && row < boxY + 3;
                    
                    if (!isSameRow && !isSameCol && !isSameBox) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                    
                    const cellKey = `${col}-${row}`;
                    const candidates = state.candidates[cellKey];
                    
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
                    if (!candidates) {
                        // eslint-disable-next-line no-continue
                        continue;
                    }
                    
                    if (candidates.includes(value)) {
                        const filtered = candidates.filter(candidate => candidate !== value);
                        if (filtered.length === 0) {
                            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                            delete state.candidates[cellKey];
                        } else {
                            state.candidates[cellKey] = filtered;
                        }
                    }
                }
            }
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
