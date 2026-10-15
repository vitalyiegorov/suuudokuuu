import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { SITE_NAME } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { buildOgImageUrl } from '../../utils/build-og-image-url.util';
import { localizePageMetadata } from '../../utils/localize-page-metadata.util';
import { resolvePageHeadline } from '../../utils/resolve-page-headline.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    metadata: PageMetadataInterface;
    author?: { readonly '@type': string; readonly name: string };
}

const ORGANIZATION_AUTHOR = { '@type': 'Organization', name: SITE_NAME };

export const ArticleSchema = ({ author = ORGANIZATION_AUTHOR, metadata }: Props) => {
    const locale = getActiveLocale();
    const localizedMetadata = localizePageMetadata(metadata, locale);
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'Article',
        headline: resolvePageHeadline(localizedMetadata),
        description: localizedMetadata.metaDescription,
        datePublished: metadata.publishedAt,
        dateModified: metadata.updatedAt,
        url: buildLocaleUrl(locale, metadata.path),
        image: buildOgImageUrl(metadata),
        inLanguage: locale,
        author,
        publisher: { '@type': 'Organization', name: SITE_NAME }
    };

    return <JsonLd data={schema} />;
};
