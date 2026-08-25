import Link from 'next/link';

import { howToPlayPageMetadata } from '../../../app/how-to-play/metadata';
import { homePageMetadata } from '../../../app/metadata';
import { printableSudokuPageMetadata } from '../../../app/printable/metadata';
import { solverPageMetadata } from '../../../app/solver/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { ComfortControl } from '../comfort-control/comfort-control';

export const SiteHeader = () => (
    <header className="site-header">
        <Link className="site-header__brand" href={homePageMetadata.path}>
            <img alt="" className="site-header__mark" height={32} src="/brand/icon-64.png" width={32} />
            {SITE_NAME}
        </Link>
        <nav aria-label="Primary" className="site-header__nav">
            <Link href={howToPlayPageMetadata.path}>How to play</Link>
            <Link href={techniquesPageMetadata.path}>Techniques</Link>
            <Link href={sudokuDifficultiesPageMetadata.path}>Difficulty</Link>
            <Link href={solverPageMetadata.path}>Solver</Link>
            <Link href={printableSudokuPageMetadata.path}>Printable</Link>
        </nav>
        <div className="site-header__controls">
            <ComfortControl />
            <a className="site-header__play" href={SITE_PLAY_URL}>
                Play
            </a>
        </div>
    </header>
);
