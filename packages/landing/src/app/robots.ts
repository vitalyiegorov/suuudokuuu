import { SITE_ORIGIN } from '../seo/constants/site.constant';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
    rules: [{ userAgent: '*', allow: ['/'], disallow: ['/_next/'] }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN
});

export default robots;
