import Link from 'next/link';

import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL, SITE_TAGLINE } from '../../../seo/constants/site.constant';

export const SiteFooter = () => (
    <footer className="site-footer">
        <nav aria-label="Footer" className="site-footer__nav">
            <Link href={techniquesPageMetadata.path}>Sudoku techniques</Link>
            <a href={SITE_PLAY_URL}>Play {SITE_NAME}</a>
        </nav>
        <p className="site-footer__note">
            {SITE_NAME} — {SITE_TAGLINE}
        </p>
    </footer>
);
