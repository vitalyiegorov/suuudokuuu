import Constants from 'expo-constants';
import { z } from 'zod';

const E2eSeedingEnabledExtraKey = 'e2eSeedingEnabled';
const E2eSeedingEnabledSchema = z.boolean();

export const getIsE2eSeedingEnabled = (): boolean => {
    const parsed = E2eSeedingEnabledSchema.safeParse(Constants.expoConfig?.extra?.[E2eSeedingEnabledExtraKey]);

    return parsed.success && parsed.data;
};
