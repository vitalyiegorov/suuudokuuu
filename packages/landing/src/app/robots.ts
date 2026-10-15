import { SITE_ORIGIN } from '../seo/constants/site.constant';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
    rules: [{ userAgent: '*', allow: ['/'] }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`
});

export default robots;
