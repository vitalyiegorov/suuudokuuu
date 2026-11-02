import { ORGANIZATION_SCHEMA, SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { SITE_NAME, SITE_ORIGIN } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';
import type { LocaleType } from '../../types/locale.type';

interface Props {
    locale: LocaleType;
    metadata: Pick<PageMetadataInterface, 'path' | 'metaDescription' | 'publishedAt' | 'updatedAt'>;
}

export const WebSiteSchema = ({ locale, metadata }: Props) => {
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        description: metadata.metaDescription,
        url: buildLocaleUrl(locale, metadata.path),
        inLanguage: locale,
        datePublished: metadata.publishedAt,
        dateModified: metadata.updatedAt,
        publisher: ORGANIZATION_SCHEMA
    };

    return <JsonLd data={schema} />;
};
