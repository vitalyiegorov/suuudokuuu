import { beforeEach, describe, expect, it, jest } from '@jest/globals';

interface MockExpoConfigInterface {
    readonly extra?: Record<string, unknown>;
}

interface MockConstantsHolderInterface {
    expoConfig: MockExpoConfigInterface | undefined;
}

const mockConstantsHolder: MockConstantsHolderInterface = { expoConfig: { extra: { e2eSeedingEnabled: true } } };

jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        get expoConfig() {
            return mockConstantsHolder.expoConfig;
        }
    }
}));

import { getIsE2eSeedingEnabled } from './get-is-e2e-seeding-enabled.util';

describe('getIsE2eSeedingEnabled', () => {
    beforeEach(() => {
        mockConstantsHolder.expoConfig = { extra: { e2eSeedingEnabled: true } };
    });

    it('returns true when the extra flag is enabled', () => {
        expect(getIsE2eSeedingEnabled()).toBe(true);
    });

    it('returns false when the extra flag is disabled', () => {
        mockConstantsHolder.expoConfig = { extra: { e2eSeedingEnabled: false } };

        expect(getIsE2eSeedingEnabled()).toBe(false);
    });

    it('returns false when the extra flag fails schema validation', () => {
        mockConstantsHolder.expoConfig = { extra: { e2eSeedingEnabled: 'true' } };

        expect(getIsE2eSeedingEnabled()).toBe(false);
    });

    it('returns false when expoConfig is missing', () => {
        mockConstantsHolder.expoConfig = undefined;

        expect(getIsE2eSeedingEnabled()).toBe(false);
    });

    it('returns false when extra is missing', () => {
        mockConstantsHolder.expoConfig = {};

        expect(getIsE2eSeedingEnabled()).toBe(false);
    });
});
