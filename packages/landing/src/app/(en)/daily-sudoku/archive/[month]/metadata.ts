import { DAILY_ARCHIVE_DATES, DAILY_ARCHIVE_MONTHS } from '../../../../../daily/constants/daily-archive.constant';
import { formatDailyMonth } from '../../../../../daily/utils/format-daily-month.util';

import type { PageMetadataInterface } from '../../../../../seo/interfaces/page-metadata.interface';

const getMonthDates = (month: string): string[] => DAILY_ARCHIVE_DATES.filter(date => date.startsWith(month));

export const buildDailyArchivePageMetadata = (month: string): PageMetadataInterface => {
    const formattedMonth = formatDailyMonth(month);
    const monthDates = getMonthDates(month);

    return {
        path: `/daily-sudoku/archive/${month}`,
        title: `Daily sudoku archive, ${formattedMonth}`,
        headline: `Daily Sudoku Archive — ${formattedMonth}`,
        metaTitle: `Daily Sudoku Archive ${formattedMonth} — Every Puzzle With Solution`,
        metaDescription: `Every Suuudokuuu daily sudoku from ${formattedMonth}, one page per day with the board, its SE rating, the techniques it needs and a step-by-step solution.`,
        publishedAt: `${monthDates.at(-1) ?? month}T00:00:00.000Z`,
        updatedAt: `${monthDates.at(0) ?? month}T00:00:00.000Z`,
        changeFrequency: 'daily',
        priority: 0.4
    };
};

export const DAILY_ARCHIVE_PAGES_METADATA: readonly PageMetadataInterface[] = DAILY_ARCHIVE_MONTHS.map(buildDailyArchivePageMetadata);
