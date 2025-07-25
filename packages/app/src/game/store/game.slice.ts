import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { initialGameState, urlToGameState } from './game.state';

import type { GameState, SerializedGameState } from './game.state';

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        start: (state, action: PayloadAction<{ sudokuString: string }>) => {
            Object.assign(state, initialGameState);

            state.sudokuString = action.payload.sudokuString;
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
        load: (state, action: PayloadAction<SerializedGameState>) => {
            Object.assign(state, urlToGameState(action.payload));
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
