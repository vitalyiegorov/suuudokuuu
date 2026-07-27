import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { emptyFn } from '@rnw-community/shared';

import { gameScreenSetSharingAvailable } from './game-screen-set-sharing-available.util';

let mockIsAvailable: Promise<boolean> = Promise.resolve(true);

jest.mock('expo-sharing', () => ({
    isAvailableAsync: () => mockIsAvailable
}));

describe('gameScreenSetSharingAvailable', () => {
    beforeEach(() => {
        mockIsAvailable = Promise.resolve(true);
    });

    it('should report that sharing is available', async () => {
        expect.assertions(1);

        const setHasSharing = jest.fn();

        gameScreenSetSharingAvailable(setHasSharing);
        await mockIsAvailable;

        expect(setHasSharing).toHaveBeenCalledWith(true);
    });

    it('should report that sharing is unavailable', async () => {
        expect.assertions(1);

        const setHasSharing = jest.fn();
        mockIsAvailable = Promise.resolve(false);

        gameScreenSetSharingAvailable(setHasSharing);
        await mockIsAvailable;

        expect(setHasSharing).toHaveBeenCalledWith(false);
    });

    it('should fall back to unavailable when the check fails', async () => {
        expect.assertions(1);

        const setHasSharing = jest.fn();
        mockIsAvailable = Promise.reject(new Error('no sharing'));

        gameScreenSetSharingAvailable(setHasSharing);
        await mockIsAvailable.catch(emptyFn);
        await Promise.resolve();

        expect(setHasSharing).toHaveBeenCalledWith(false);
    });
});
