import { isNotEmptyString } from '@rnw-community/shared';

import { INDEXNOW_KEY_ENVIRONMENT_VARIABLE, INDEXNOW_KEY_PATTERN } from '../constants/indexnow.constant';

export const resolveIndexNowKey = (): string => {
    const rawKey = process.env[INDEXNOW_KEY_ENVIRONMENT_VARIABLE];

    if (!isNotEmptyString(rawKey)) {
        return '';
    }

    const key = rawKey.trim();

    if (!INDEXNOW_KEY_PATTERN.test(key)) {
        throw new Error(`${INDEXNOW_KEY_ENVIRONMENT_VARIABLE} must be 8 to 128 characters of a-z, A-Z, 0-9 or "-", it currently is not.`);
    }

    return key;
};
