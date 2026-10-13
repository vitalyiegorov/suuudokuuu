import { isPositiveNumber } from '@rnw-community/shared';

import { SecondsPerDay, SecondsPerHour, SecondsPerMinute } from '../../@generic/constants/time.constant';
import { ChallengeDurationUnit } from '../enums/challenge-duration-unit.enum';

import type { ChallengeDurationPartsInterface } from '../interfaces/challenge-duration.interface';

const getPartsWithSecondary = (
    primaryUnit: ChallengeDurationUnit,
    primaryValue: number,
    secondaryUnit: ChallengeDurationUnit,
    secondaryValue: number
): ChallengeDurationPartsInterface => ({
    primary: { unit: primaryUnit, value: primaryValue },
    ...(isPositiveNumber(secondaryValue) && { secondary: { unit: secondaryUnit, value: secondaryValue } })
});

export const getChallengeDurationParts = (seconds: number): ChallengeDurationPartsInterface => {
    const normalizedSeconds = Math.max(0, Math.floor(seconds));

    if (normalizedSeconds >= SecondsPerDay) {
        return getPartsWithSecondary(
            ChallengeDurationUnit.DAY,
            Math.floor(normalizedSeconds / SecondsPerDay),
            ChallengeDurationUnit.HOUR,
            Math.floor((normalizedSeconds % SecondsPerDay) / SecondsPerHour)
        );
    }

    if (normalizedSeconds >= SecondsPerHour) {
        return getPartsWithSecondary(
            ChallengeDurationUnit.HOUR,
            Math.floor(normalizedSeconds / SecondsPerHour),
            ChallengeDurationUnit.MINUTE,
            Math.floor((normalizedSeconds % SecondsPerHour) / SecondsPerMinute)
        );
    }

    if (normalizedSeconds >= SecondsPerMinute) {
        return getPartsWithSecondary(
            ChallengeDurationUnit.MINUTE,
            Math.floor(normalizedSeconds / SecondsPerMinute),
            ChallengeDurationUnit.SECOND,
            normalizedSeconds % SecondsPerMinute
        );
    }

    return { primary: { unit: ChallengeDurationUnit.SECOND, value: normalizedSeconds } };
};
