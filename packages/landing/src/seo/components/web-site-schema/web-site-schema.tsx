import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_NAME } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    metadata: Pick<PageMetadataInterface, 'path' | 'publishedAt' | 'updatedAt'>;
}

export const WebSiteSchema = ({ metadata }: Props) => {
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'WebSite',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: buildLocaleUrl(DEFAULT_LOCALE, metadata.path),
        inLanguage: DEFAULT_LOCALE,
        datePublished: metadata.publishedAt,
        dateModified: metadata.updatedAt
    };

    return <JsonLd data={schema} />;
};
