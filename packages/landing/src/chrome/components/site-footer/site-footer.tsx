import Link from 'next/link';

import { glossaryPageMetadata } from '../../../app/glossary/metadata';
import { howToPlayPageMetadata } from '../../../app/how-to-play/metadata';
import { sudokuDifficultiesPageMetadata } from '../../../app/sudoku/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL, SITE_TAGLINE } from '../../../seo/constants/site.constant';

export const SiteFooter = () => (
    <footer className="site-footer">
        <nav aria-label="Footer" className="site-footer__nav">
            <Link href={sudokuDifficultiesPageMetadata.path}>Sudoku difficulty levels</Link>
            <Link href={howToPlayPageMetadata.path}>How to play</Link>
            <Link href={techniquesPageMetadata.path}>Sudoku techniques</Link>
            <Link href={glossaryPageMetadata.path}>Sudoku glossary</Link>
            <a href={SITE_PLAY_URL}>Play {SITE_NAME}</a>
        </nav>
        <p className="site-footer__note">
            {SITE_NAME} — {SITE_TAGLINE}
        </p>
    </footer>
);
