import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Solution } from '@suuudokuuu/encoder';
import { TechniqueManager } from '@suuudokuuu/generator';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { maxCompletedGamesPerDifficulty } from '../../history/constants/max-completed-games-per-difficulty.constant';
import { SudokuScoring } from '../../scoring/classes/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/interfaces/scoring-config.interface';
import { gameStateToString } from '../utils/game-state-to-string.util';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { CellInterface, DifficultyEnum, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

const techniqueManager = new TechniqueManager();

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

            const technique = techniqueManager.identify(sudoku.Field, correctCell, correctCell.value);

            const solution = Solution.fromSteps(state.solutionSteps);
            solution.addStep(correctCell, state.elapsedTime, technique);
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
        finish: (state, action: PayloadAction<{ difficulty: DifficultyEnum; isWon: boolean; isChallenge?: boolean }>) => {
            const { difficulty, isWon, isChallenge = false } = action.payload;
            const history = state.historyByDifficulty[difficulty];

            history.averageTime = (history.averageTime * history.gamesCompleted + state.elapsedTime) / (history.gamesCompleted + 1);
            history.gamesCompleted += 1;

            if (isWon) {
                history.gamesWon += 1;
                history.gamesWonWithoutMistakes += state.mistakes === 0 ? 1 : 0;
                history.hardcoreWon += state.maxMistakes === 0 ? 1 : 0;
                history.challengesWon += isChallenge ? 1 : 0;
                history.completedGames = [
                    {
                        difficulty,
                        encodedState: gameStateToString(state, true),
                        elapsedTime: state.elapsedTime,
                        score: state.score,
                        mistakes: state.mistakes,
                        maxMistakes: state.maxMistakes,
                        completedAt: Date.now()
                    },
                    ...history.completedGames
                ].slice(0, maxCompletedGamesPerDifficulty);

                if (state.score > history.bestScore) {
                    history.bestScore = state.score;
                    history.bestTime = state.elapsedTime;
                }
            } else {
                history.gamesLost += 1;
                history.challengesLost += isChallenge ? 1 : 0;
            }
        }
    }
});
