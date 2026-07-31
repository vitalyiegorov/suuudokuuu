import { describe, expect, it } from '@jest/globals';

import { initialGameState } from '../../game/store/game.state';
import { initialSettingsState } from '../../settings/store/settings.state';
import { initialCustomThemesState } from '../../theme/store/custom-themes.state';
import { HellQueueLowWaterMark } from '../constants/hell-queue.constant';
import { HellQueueEntrySchemaVersion } from '../schema/hell-queue-entry.schema';

import {
    hellQueueCountSelector,
    hellQueueEntriesSelector,
    hellQueueFirstEntrySelector,
    hellQueueIsBelowLowWaterMarkSelector
} from './hell-queue.selectors';

import type { RootState } from '../../@generic/app-root.store';
import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

const HellQueueFieldStringLength = 81;

const buildEntry = (id: string): HellQueueEntryInterface => ({
    id,
    puzzle: id,
    solution: id,
    givensCount: 17,
    createdAt: 1,
    generatorVersion: 1,
    schemaVersion: HellQueueEntrySchemaVersion
});

const firstEntry = buildEntry('1'.repeat(HellQueueFieldStringLength));
const secondEntry = buildEntry('2'.repeat(HellQueueFieldStringLength));

const buildRootState = (entries: readonly HellQueueEntryInterface[]): RootState => ({
    game: initialGameState,
    settings: initialSettingsState,
    customThemes: initialCustomThemesState,
    hellQueue: { entries }
});

describe('hellQueue selectors', () => {
    it('should read the stored entries out of the root state', () => {
        expect.assertions(1);

        expect(hellQueueEntriesSelector(buildRootState([firstEntry, secondEntry]))).toEqual([firstEntry, secondEntry]);
    });

    it('should count the stored entries', () => {
        expect.assertions(1);

        expect(hellQueueCountSelector(buildRootState([firstEntry, secondEntry]))).toBe(2);
    });

    it('should read the first entry when present', () => {
        expect.assertions(1);

        expect(hellQueueFirstEntrySelector(buildRootState([firstEntry, secondEntry]))).toEqual(firstEntry);
    });

    it('should read undefined for the first entry of an empty queue', () => {
        expect.assertions(1);

        expect(hellQueueFirstEntrySelector(buildRootState([]))).toBeUndefined();
    });

    it('should report below the low water mark when the queue is empty', () => {
        expect.assertions(1);

        expect(hellQueueIsBelowLowWaterMarkSelector(buildRootState([]))).toBe(true);
    });

    it('should report at or above the low water mark once enough entries are queued', () => {
        expect.assertions(1);

        const entries = Array.from({ length: HellQueueLowWaterMark }, (_unusedValue, index) =>
            buildEntry(String(index).repeat(HellQueueFieldStringLength))
        );

        expect(hellQueueIsBelowLowWaterMarkSelector(buildRootState(entries))).toBe(false);
    });
});
