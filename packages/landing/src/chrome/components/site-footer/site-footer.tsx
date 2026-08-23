import Link from 'next/link';

import { glossaryPageMetadata } from '../../../app/glossary/metadata';
import { sudokuCluesVsDifficultyPageMetadata } from '../../../app/guides/sudoku-clues-vs-difficulty/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../../app/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/how-to-play/metadata';
import { largePrintSudokuPageMetadata } from '../../../app/large-print-sudoku/metadata';
import { printableSudokuPageMetadata } from '../../../app/printable/metadata';
import { solverPageMetadata } from '../../../app/solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/sudoku/metadata';
import { sudokuForSeniorsPageMetadata } from '../../../app/sudoku-for-seniors/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { whySuuudokuuuPageMetadata } from '../../../app/why-suuudokuuu/metadata';
import { SITE_GITHUB_URL, SITE_LICENSE, SITE_NAME, SITE_PLAY_URL, SITE_TAGLINE } from '../../../seo/constants/site.constant';

export const SiteFooter = () => (
    <footer className="site-footer">
        <nav aria-label="Footer" className="site-footer__nav">
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link>
            <Link href={howToPlayPageMetadata.path}>How to play</Link>
            <Link href={sudokuForSeniorsPageMetadata.path}>Sudoku for seniors</Link>
            <Link href={techniquesPageMetadata.path}>Sudoku techniques</Link>
            <Link href={printableSudokuPageMetadata.path}>Printable sudoku</Link>
            <Link href={largePrintSudokuPageMetadata.path}>Large print sudoku</Link>
            <Link href={sudokuDifficultyRatingPageMetadata.path}>Sudoku difficulty rating</Link>
            <Link href={sudokuCluesVsDifficultyPageMetadata.path}>Clues versus difficulty</Link>
            <Link href={solverPageMetadata.path}>Sudoku solver</Link>
            <Link href={glossaryPageMetadata.path}>Sudoku glossary</Link>
            <Link href={whySuuudokuuuPageMetadata.path}>Why {SITE_NAME}</Link>
            <a href={SITE_PLAY_URL}>Play {SITE_NAME}</a>
            <a href={SITE_GITHUB_URL}>Source code on GitHub</a>
        </nav>
        <p className="site-footer__note">
            {SITE_NAME} — {SITE_TAGLINE}
        </p>
        <p className="site-footer__note">
            Free and open source under the {SITE_LICENSE} license. No ads, no trackers, no account — read{' '}
            <Link href={whySuuudokuuuPageMetadata.path}>why</Link> or browse the <a href={SITE_GITHUB_URL}>full source on GitHub</a>.
        </p>
    </footer>
);
