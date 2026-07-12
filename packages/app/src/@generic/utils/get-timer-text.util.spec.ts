import { describe, expect, it } from '@jest/globals';

import { getTimerText } from './get-timer-text.util';

const MinuteAndFiveSeconds = 65;
const ElevenHoursTwentyFourMinutesFortySevenSeconds = 41087;
const OneDayTwoHoursTwoMinutes = 93720;

describe('getTimerText', () => {
    it('keeps short timers in stopwatch format', () => {
        expect(getTimerText(MinuteAndFiveSeconds)).toBe('01:05');
    });

    it('compacts hour-long timers so metric cards do not overflow', () => {
        expect(getTimerText(ElevenHoursTwentyFourMinutesFortySevenSeconds)).toBe('11h 24m');
    });

    it('compacts multi-day timers to the largest useful units', () => {
        expect(getTimerText(OneDayTwoHoursTwoMinutes)).toBe('1d 2h');
    });
});
