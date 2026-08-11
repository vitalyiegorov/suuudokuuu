import { SUPPORTED_LOCALES } from '../seo/constants/site.constant';
import { PAGE_METADATA_REGISTRY } from '../seo/registries/page-metadata.registry';
import { buildLanguageAlternates } from '../seo/utils/build-language-alternates.util';
import { buildLocaleUrl } from '../seo/utils/build-locale-url.util';

import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap =>
    PAGE_METADATA_REGISTRY.flatMap(pageMetadata =>
        SUPPORTED_LOCALES.map(locale => ({
            url: buildLocaleUrl(locale, pageMetadata.path),
            lastModified: pageMetadata.updatedAt,
            changeFrequency: pageMetadata.changeFrequency,
            priority: pageMetadata.priority,
            alternates: { languages: buildLanguageAlternates(pageMetadata.path) }
        }))
    );

export default sitemap;
