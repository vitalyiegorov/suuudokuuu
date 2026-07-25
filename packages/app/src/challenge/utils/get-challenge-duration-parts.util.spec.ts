import { describe, expect, it } from '@jest/globals';

import { ChallengeDurationUnit } from '../interfaces/challenge-duration.interface';

import { getChallengeDurationParts } from './get-challenge-duration-parts.util';

const FiftyNineSeconds = 59;
const OneMinute = 60;
const TwoMinutesFiveSeconds = 125;
const OneHour = 3600;
const TwoHoursTwoMinutesFiftyNineSeconds = 7379;
const OneDay = 86400;
const TwoDaysThreeHours = 183600;

describe('getChallengeDurationParts', () => {
    it('keeps margins under one minute in seconds', () => {
        expect(getChallengeDurationParts(FiftyNineSeconds)).toEqual({
            primary: { unit: ChallengeDurationUnit.Second, value: FiftyNineSeconds }
        });
    });

    it('uses minutes and seconds for margins under one hour', () => {
        expect(getChallengeDurationParts(TwoMinutesFiveSeconds)).toEqual({
            primary: { unit: ChallengeDurationUnit.Minute, value: 2 },
            secondary: { unit: ChallengeDurationUnit.Second, value: 5 }
        });
    });

    it('omits zero seconds from an exact minute margin', () => {
        expect(getChallengeDurationParts(OneMinute)).toEqual({ primary: { unit: ChallengeDurationUnit.Minute, value: 1 } });
    });

    it('uses hours and minutes for margins under one day', () => {
        expect(getChallengeDurationParts(TwoHoursTwoMinutesFiftyNineSeconds)).toEqual({
            primary: { unit: ChallengeDurationUnit.Hour, value: 2 },
            secondary: { unit: ChallengeDurationUnit.Minute, value: 2 }
        });
    });

    it('omits zero minutes from an exact hour margin', () => {
        expect(getChallengeDurationParts(OneHour)).toEqual({ primary: { unit: ChallengeDurationUnit.Hour, value: 1 } });
    });

    it('uses days and hours for multi-day margins', () => {
        expect(getChallengeDurationParts(TwoDaysThreeHours)).toEqual({
            primary: { unit: ChallengeDurationUnit.Day, value: 2 },
            secondary: { unit: ChallengeDurationUnit.Hour, value: 3 }
        });
    });

    it('omits zero hours from an exact day margin', () => {
        expect(getChallengeDurationParts(OneDay)).toEqual({ primary: { unit: ChallengeDurationUnit.Day, value: 1 } });
    });
});
