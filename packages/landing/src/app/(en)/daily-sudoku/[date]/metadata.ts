import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';

import { DAILY_ARCHIVE_DATES } from '../../../../daily/constants/daily-archive.constant';
import { formatDailyDate } from '../../../../daily/utils/format-daily-date.util';
import { DIFFICULTY_NAMES } from '../../../../difficulty/constants/difficulty-name.constant';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const buildDailyPuzzlePageMetadata = (date: string): PageMetadataInterface => {
    const formattedDate = formatDailyDate(date);
    const difficultyName = DIFFICULTY_NAMES[getDailyDifficulty(date)];

    return {
        path: `/daily-sudoku/${date}`,
        title: `Daily sudoku, ${formattedDate}`,
        headline: `Daily Sudoku for ${formattedDate}`,
        metaTitle: `Daily Sudoku ${formattedDate} — ${difficultyName} Puzzle With Solution`,
        metaDescription: `The ${difficultyName.toLowerCase()} daily sudoku for ${formattedDate}: play it online, see its SE rating and the techniques it needs, and step through the full solution.`,
        publishedAt: `${date}T00:00:00.000Z`,
        updatedAt: `${date}T00:00:00.000Z`,
        changeFrequency: 'yearly',
        priority: 0.5
    };
};

export const DAILY_PUZZLE_PAGES_METADATA: readonly PageMetadataInterface[] = DAILY_ARCHIVE_DATES.map(buildDailyPuzzlePageMetadata);
