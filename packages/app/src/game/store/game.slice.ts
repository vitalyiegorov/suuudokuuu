import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Solution } from '@suuudokuuu/encoder';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { defaultScoringConfig } from '../../scoring/scoring-config.interface';
import { SudokuScoring } from '../../scoring/sudoku-scoring';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';
import type { HistoryGameInterface } from '../../history/interfaces/history-game.interface';
import type { CellInterface, DifficultyEnum, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';

interface FinishGameParams {
    history: HistoryGameInterface;
    isWon: boolean;
    isChallenge: boolean;
    mistakes: number;
    maxMistakes: number;
    score: number;
    elapsedTime: number;
}

const updateHistoryOnWin = (params: FinishGameParams): void => {
    const { history, isChallenge, mistakes, maxMistakes, score, elapsedTime } = params;
    history.gamesWon += 1;
    if (mistakes === 0) {history.gamesWonWithoutMistakes += 1;}
    if (maxMistakes === 0) {history.hardcoreWon += 1;}
    if (score > history.bestScore) {
        history.bestScore = score;
        history.bestTime = elapsedTime;
    }
    if (isChallenge) {history.challengesWon += 1;}
};

const updateHistoryOnFinish = (params: FinishGameParams): void => {
    const { history, isWon, isChallenge } = params;
    if (isWon) {
        updateHistoryOnWin(params);
    } else {
        history.gamesLost += 1;
        if (isChallenge) {history.challengesLost += 1;}
    }
};

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

        finish: (state, action: PayloadAction<{ difficulty: DifficultyEnum; isWon: boolean; isChallenge?: boolean }>) => {
            const { difficulty, isWon, isChallenge = false } = action.payload;
            const history = state.historyByDifficulty[difficulty];

            history.gamesCompleted += 1;
            history.averageTime = (history.averageTime * history.gamesCompleted + state.elapsedTime) / history.gamesCompleted;

            updateHistoryOnFinish({
                history,
                isWon,
                isChallenge,
                mistakes: state.mistakes,
                maxMistakes: state.maxMistakes,
                score: state.score,
                elapsedTime: state.elapsedTime
            });
        }
    }
});
