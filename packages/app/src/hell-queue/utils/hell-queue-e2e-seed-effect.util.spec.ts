import { describe, expect, it, jest } from '@jest/globals';

import { createAppTestStore } from '../../@generic/utils/create-app-test-store.mock';
import { HellQueueE2eSeedEntry } from '../constants/hell-queue-e2e-seed-entry.constant';

const mockGetIsE2eSeedingEnabled = jest.fn();

jest.mock('../../@generic/utils/get-is-e2e-seeding-enabled.util', () => ({
    getIsE2eSeedingEnabled: () => mockGetIsE2eSeedingEnabled()
}));

import { hellQueueRunE2eSeedEffect } from './hell-queue-e2e-seed-effect.util';

describe('hellQueueRunE2eSeedEffect', () => {
    it('dispatches the fixed Hell queue entry and redirects home when E2E seeding is enabled', () => {
        mockGetIsE2eSeedingEnabled.mockReturnValue(true);
        const store = createAppTestStore();
        const replace = jest.fn();

        hellQueueRunE2eSeedEffect({ dispatch: store.dispatch, replace });

        expect(store.getState().hellQueue.entries).toEqual([HellQueueE2eSeedEntry]);
        expect(replace).toHaveBeenCalledWith('/');
    });

    it('does not dispatch but still redirects home when E2E seeding is disabled', () => {
        mockGetIsE2eSeedingEnabled.mockReturnValue(false);
        const store = createAppTestStore();
        const replace = jest.fn();

        hellQueueRunE2eSeedEffect({ dispatch: store.dispatch, replace });

        expect(store.getState().hellQueue.entries).toEqual([]);
        expect(replace).toHaveBeenCalledWith('/');
    });
});
