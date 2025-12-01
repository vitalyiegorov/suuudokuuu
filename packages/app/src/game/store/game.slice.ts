import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { Solution } from '../../history/classes/solution';
import { getOriginalSudokuString } from '../../history/util/get-original-sudoku-string.util';
import { defaultScoringConfig } from '../../scoring/scoring-config.interface';
import { SudokuScoring } from '../../scoring/sudoku-scoring';

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
            const { sudoku, correctCell, scoredCells } = action.payload;

            state.sudokuString = sudoku.toString();

            const scoring = new SudokuScoring(defaultScoringConfig);
            state.score += scoring.calculate({
                scoredCells,
                difficulty: sudoku.Difficulty,
                mistakes: state.mistakes,
                elapsedTime: state.elapsedTime,
                maxMistakes: state.maxMistakes
            });

            const solution = Solution.fromSteps(state.solutionSteps);
            solution.addStep(correctCell, state.elapsedTime);
            state.solutionSteps = solution.getSteps();

            state.candidates[getCellKey(correctCell)] = [];

            sudoku.Field.forEach(
                row =>
                    void row.forEach(cell => {
                        if (
                            sudoku.isBlankCell(cell) &&
                            (cell.x === correctCell.x || cell.y === correctCell.y || cell.group === correctCell.group)
                        ) {
                            const possibleCandidates = sudoku.getCellCandidates(cell);

                            const key = getCellKey(cell);
                            const currentCandidates = state.candidates[key] ?? [];

                            state.candidates[key] = currentCandidates.filter(candidate => possibleCandidates.includes(candidate));
                        }
                    })
            );
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
        retryChallenge: state => {
            const originalSudokuString = getOriginalSudokuString(state.sudokuString, state.solutionSteps);
            const { maxMistakes, opponentSteps, opponentTotalTime, historyByDifficulty } = state;

            Object.assign(state, {
                ...initialGameState,
                historyByDifficulty,
                sudokuString: originalSudokuString,
                maxMistakes,
                isChallengeMode: true,
                opponentSteps,
                opponentTotalTime
            });
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
