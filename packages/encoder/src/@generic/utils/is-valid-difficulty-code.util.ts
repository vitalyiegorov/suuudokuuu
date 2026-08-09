import { isNumber } from '@rnw-community/shared';

import { DIFFICULTY_CODE_MAX } from '../constants/binary-codec.constant';

export const isValidDifficultyCode = (code: number | null): code is number =>
    isNumber(code) && Number.isInteger(code) && code >= 0 && code <= DIFFICULTY_CODE_MAX;
