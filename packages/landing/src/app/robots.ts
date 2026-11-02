import { AI_CRAWLER_USER_AGENTS } from '../seo/constants/crawler.constant';
import { SITE_ORIGIN } from '../seo/constants/site.constant';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
    rules: [...AI_CRAWLER_USER_AGENTS.map(userAgent => ({ userAgent, allow: ['/'] })), { userAgent: '*', allow: ['/'] }],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`
});

export default robots;
