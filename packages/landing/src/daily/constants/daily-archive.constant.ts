import { getDailyDateString, getDailyDayNumber } from '@suuudokuuu/puzzle-forge';

import { isNotEmptyString } from '@rnw-community/shared';

const DAILY_ARCHIVE_START_DATE = '2026-09-15';

const DAILY_BUILD_DATE_ENVIRONMENT_VARIABLE = 'LANDING_BUILD_DATE';

const DAILY_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

const MILLISECONDS_PER_DAY = 86_400_000;

const DAILY_MONTH_KEY_LENGTH = 7;

const resolveBuildDate = (): string => {
    const configuredDate = process.env[DAILY_BUILD_DATE_ENVIRONMENT_VARIABLE];

    return isNotEmptyString(configuredDate) && DAILY_DATE_PATTERN.test(configuredDate) ? configuredDate : getDailyDateString(Date.now());
};

export const DAILY_BUILD_DATE = resolveBuildDate();

const firstDayNumber = getDailyDayNumber(DAILY_ARCHIVE_START_DATE);

const lastDayNumber = getDailyDayNumber(DAILY_BUILD_DATE);

export const DAILY_ARCHIVE_DATES: readonly string[] = Array.from({ length: lastDayNumber - firstDayNumber + 1 }, (_, offset) =>
    getDailyDateString((lastDayNumber - offset) * MILLISECONDS_PER_DAY)
);

export const DAILY_ARCHIVE_MONTHS: readonly string[] = [...new Set(DAILY_ARCHIVE_DATES.map(date => date.slice(0, DAILY_MONTH_KEY_LENGTH)))];

export const DAILY_RECENT_DAY_COUNT = 30;
