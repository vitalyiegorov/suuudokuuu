import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE, SITE_NAME } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { buildOgImageUrl } from '../../utils/build-og-image-url.util';
import { resolvePageHeadline } from '../../utils/resolve-page-headline.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    metadata: PageMetadataInterface;
}

export const ArticleSchema = ({ metadata }: Props) => {
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'Article',
        headline: resolvePageHeadline(metadata),
        description: metadata.metaDescription,
        datePublished: metadata.publishedAt,
        dateModified: metadata.updatedAt,
        url: buildLocaleUrl(DEFAULT_LOCALE, metadata.path),
        image: buildOgImageUrl(metadata),
        inLanguage: DEFAULT_LOCALE,
        author: { '@type': 'Organization', name: SITE_NAME },
        publisher: { '@type': 'Organization', name: SITE_NAME }
    };

    return <JsonLd data={schema} />;
};
