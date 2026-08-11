import Link from 'next/link';

import { homePageMetadata } from '../../../app/metadata';
import { techniquesPageMetadata } from '../../../app/techniques/metadata';
import { SITE_NAME, SITE_PLAY_URL } from '../../../seo/constants/site.constant';

export const SiteHeader = () => (
    <header className="site-header">
        <Link className="site-header__brand" href={homePageMetadata.path}>
            {SITE_NAME}
        </Link>
        <nav aria-label="Primary" className="site-header__nav">
            <Link href={techniquesPageMetadata.path}>Techniques</Link>
            <a href={SITE_PLAY_URL}>Play</a>
        </nav>
    </header>
);
