import Link from 'next/link';

import { glossaryPageMetadata } from '../../../app/glossary/metadata';
import { sudokuDifficultyRatingPageMetadata } from '../../../app/guides/sudoku-difficulty-rating/metadata';
import { howToPlayPageMetadata } from '../../../app/how-to-play/metadata';
import { homePageMetadata } from '../../../app/metadata';
import { solverPageMetadata } from '../../../app/solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';

export const SiteHeader = () => (
    <header className="site-header">
        <Link className="site-header__brand" href={homePageMetadata.path}>
            {SITE_NAME}
        </Link>
        <nav aria-label="Primary" className="site-header__nav">
            <Link href={sudokuDifficultiesPageMetadata.path}>Difficulty levels</Link>
            <Link href={howToPlayPageMetadata.path}>How to play</Link>
            <Link href={techniquesPageMetadata.path}>Techniques</Link>
            <Link href={sudokuDifficultyRatingPageMetadata.path}>Difficulty rating</Link>
            <Link href={solverPageMetadata.path}>Solver</Link>
            <Link href={glossaryPageMetadata.path}>Glossary</Link>
            <a href={SITE_PLAY_URL}>Play</a>
        </nav>
    </header>
);
