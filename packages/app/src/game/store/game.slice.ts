import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialGameState } from './game.state';

import type { GameState } from './game.state';

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
        save: (state, action: PayloadAction<Pick<GameState, 'sudokuString' | 'score' | 'mistakes'>>) => {
            state.sudokuString = action.payload.sudokuString;
            state.score = action.payload.score;
            state.mistakes = action.payload.mistakes;
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
        }
    }
});
