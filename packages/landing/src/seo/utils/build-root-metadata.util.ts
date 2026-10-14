import { SITE_APP_STORE_ID, SITE_NAME, SITE_ORIGIN } from '../constants/site.constant';

import type { Metadata } from 'next';

export const buildRootMetadata = (): Metadata => ({
    metadataBase: new URL(SITE_ORIGIN),
    applicationName: SITE_NAME,
    itunes: { appId: SITE_APP_STORE_ID }
});
