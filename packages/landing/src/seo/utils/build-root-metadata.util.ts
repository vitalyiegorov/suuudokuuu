import { SITE_NAME, SITE_ORIGIN } from '../constants/site.constant';

import type { Metadata } from 'next';

export const buildRootMetadata = (): Metadata => ({
    metadataBase: new URL(SITE_ORIGIN),
    applicationName: SITE_NAME,
    robots: { index: true, follow: true }
});
