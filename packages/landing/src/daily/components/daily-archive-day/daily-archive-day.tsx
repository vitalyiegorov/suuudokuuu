import { getDailyDifficulty } from '@suuudokuuu/puzzle-forge';
import Link from 'next/link';

import { buildDailyPuzzlePageMetadata } from '../../../app/(en)/daily-sudoku/[date]/metadata';
import { DIFFICULTY_NAMES } from '../../../difficulty/constants/difficulty-name.constant';
import { formatDailyDate } from '../../utils/format-daily-date.util';

interface Props {
    date: string;
}

export const DailyArchiveDay = ({ date }: Props) => (
    <li>
        <Link href={buildDailyPuzzlePageMetadata(date).path}>{formatDailyDate(date)}</Link> — {DIFFICULTY_NAMES[getDailyDifficulty(date)]}
    </li>
);
