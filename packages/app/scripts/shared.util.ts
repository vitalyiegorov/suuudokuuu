import { createRequire } from 'node:module';

const sharedUtilities: Pick<
    typeof import('@rnw-community/shared'),
    'getErrorMessage' | 'isNotEmptyArray' | 'isNotEmptyString' | 'isString'
> = createRequire(import.meta.url)('@rnw-community/shared');

export const { getErrorMessage, isNotEmptyArray, isNotEmptyString, isString } = sharedUtilities;
