import { SiteDocument } from '../chrome/components/site-document/site-document';
import { DEFAULT_LOCALE, SITE_VIEWPORT } from '../seo/constants/site.constant';
import { buildRootMetadata } from '../seo/utils/build-root-metadata.util';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    ...buildRootMetadata(),
    title: '404: This page could not be found.',
    robots: { index: false }
};

export const viewport: Viewport = SITE_VIEWPORT;

const GlobalNotFound = () => (
    <SiteDocument locale={DEFAULT_LOCALE}>
        <main>
            <h1>404</h1>
            <p>This page could not be found.</p>
        </main>
    </SiteDocument>
);

export default GlobalNotFound;
