import { isPositiveNumber } from '@rnw-community/shared';

import { SecondsPerDay, SecondsPerHour, SecondsPerMinute } from '../../@generic/constants/time.constant';
import { ChallengeDurationUnit } from '../interfaces/challenge-duration.interface';

import type { ChallengeDurationPartsInterface } from '../interfaces/challenge-duration.interface';

const getNormalizedSeconds = (seconds: number): number => Math.max(0, Math.floor(seconds));

const getPartsWithSecondary = (
    primaryUnit: ChallengeDurationUnit,
    primaryValue: number,
    secondaryUnit: ChallengeDurationUnit,
    secondaryValue: number
): ChallengeDurationPartsInterface => ({
    primary: { unit: primaryUnit, value: primaryValue },
    ...(isPositiveNumber(secondaryValue) && { secondary: { unit: secondaryUnit, value: secondaryValue } })
});

const getDaysAndHours = (seconds: number): ChallengeDurationPartsInterface => {
    const days = Math.floor(seconds / SecondsPerDay);
    const remainingSeconds = seconds % SecondsPerDay;
    const hours = Math.floor(remainingSeconds / SecondsPerHour);

    return getPartsWithSecondary(ChallengeDurationUnit.Day, days, ChallengeDurationUnit.Hour, hours);
};

const getHoursAndMinutes = (seconds: number): ChallengeDurationPartsInterface => {
    const hours = Math.floor(seconds / SecondsPerHour);
    const remainingSeconds = seconds % SecondsPerHour;
    const minutes = Math.floor(remainingSeconds / SecondsPerMinute);

    return getPartsWithSecondary(ChallengeDurationUnit.Hour, hours, ChallengeDurationUnit.Minute, minutes);
};

const getMinutesAndSeconds = (seconds: number): ChallengeDurationPartsInterface => {
    const minutes = Math.floor(seconds / SecondsPerMinute);
    const secondsRemainder = seconds % SecondsPerMinute;

    return getPartsWithSecondary(ChallengeDurationUnit.Minute, minutes, ChallengeDurationUnit.Second, secondsRemainder);
};

export const getChallengeDurationParts = (seconds: number): ChallengeDurationPartsInterface => {
    const normalizedSeconds = getNormalizedSeconds(seconds);

    if (normalizedSeconds >= SecondsPerDay) {
        return getDaysAndHours(normalizedSeconds);
    }

    if (normalizedSeconds >= SecondsPerHour) {
        return getHoursAndMinutes(normalizedSeconds);
    }

    if (normalizedSeconds >= SecondsPerMinute) {
        return getMinutesAndSeconds(normalizedSeconds);
    }

    return { primary: { unit: ChallengeDurationUnit.Second, value: normalizedSeconds } };
};
