import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { HellQueueCapacity } from '../constants/hell-queue.constant';

import { initialHellQueueState } from './hell-queue.state';

import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

export const hellQueueSlice = createSlice({
    name: 'hellQueue',
    initialState: initialHellQueueState,
    reducers: {
        enqueue: (state, action: PayloadAction<HellQueueEntryInterface>) => {
            const isDuplicate = state.entries.some(entry => entry.id === action.payload.id);
            const isAtCapacity = state.entries.length >= HellQueueCapacity;

            if (!isDuplicate && !isAtCapacity) {
                state.entries = [...state.entries, action.payload];
            }
        },
        consume: (state, action: PayloadAction<Pick<HellQueueEntryInterface, 'id'>>) => {
            state.entries = state.entries.filter(entry => entry.id !== action.payload.id);
        }
    }
});
