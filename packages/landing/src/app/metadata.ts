import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '../seo/constants/site.constant';

import type { PageMetadataInterface } from '../seo/interfaces/page-metadata.interface';

export const homePageMetadata: PageMetadataInterface = {
    path: '/',
    title: SITE_NAME,
    metaTitle: `${SITE_NAME} — ${SITE_TAGLINE}`,
    metaDescription: SITE_DESCRIPTION,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 1
};
