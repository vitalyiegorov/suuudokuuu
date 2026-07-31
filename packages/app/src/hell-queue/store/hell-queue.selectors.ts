import { createSelector } from '@reduxjs/toolkit';

import { HellQueueLowWaterMark } from '../constants/hell-queue.constant';

import type { RootState } from '../../@generic/app-root.store';

const hellQueueStateSelector = (state: RootState) => state.hellQueue;

export const hellQueueEntriesSelector = createSelector(hellQueueStateSelector, state => state.entries);
export const hellQueueCountSelector = createSelector(hellQueueEntriesSelector, entries => entries.length);
export const hellQueueFirstEntrySelector = createSelector(hellQueueEntriesSelector, entries => entries[0]);
export const hellQueueIsBelowLowWaterMarkSelector = createSelector(hellQueueCountSelector, count => count < HellQueueLowWaterMark);
