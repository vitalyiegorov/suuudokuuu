/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { dailyGetCompletedDays } from './daily-get-completed-days.util';

describe('dailyGetCompletedDays', () => {
    it('should return completed days newest first with their derived difficulty', () => {
        expect.assertions(3);

        const completedDays = dailyGetCompletedDays([20691, 20690, 20692]);

        expect(completedDays.map(({ dayNumber }) => dayNumber)).toStrictEqual([20692, 20691, 20690]);
        expect(completedDays[0]?.dateString).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
        expect(completedDays[0]?.difficulty).toBeDefined();
    });

    it('should keep only the most recent solves', () => {
        expect.assertions(1);

        const completedDayNumbers = Array.from({ length: 25 }, (_unusedValue, index) => 20600 + index);
        const completedDays = dailyGetCompletedDays(completedDayNumbers);

        expect(completedDays).toHaveLength(10);
    });

    it('should return an empty list when nothing was solved', () => {
        expect.assertions(1);

        expect(dailyGetCompletedDays([])).toStrictEqual([]);
    });
});
