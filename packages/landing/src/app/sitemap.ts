import { buildIndexablePages } from '../indexing/utils/build-indexable-pages.util';
import { buildLanguageAlternates } from '../seo/utils/build-language-alternates.util';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap =>
    buildIndexablePages().map(({ url, pageMetadata }) => ({
        url,
        lastModified: pageMetadata.updatedAt,
        changeFrequency: pageMetadata.changeFrequency,
        priority: pageMetadata.priority,
        alternates: { languages: buildLanguageAlternates(pageMetadata.path) }
    }));

export default sitemap;
