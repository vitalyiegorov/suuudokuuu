import { SITE_BACKGROUND_COLOR, SITE_DESCRIPTION, SITE_NAME, SITE_THEME_COLOR } from '../seo/constants/site.constant';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const manifest = (): MetadataRoute.Manifest => ({
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'browser',
    orientation: 'any',
    background_color: SITE_BACKGROUND_COLOR,
    theme_color: SITE_THEME_COLOR
});

export default manifest;
