import { getActiveLocale } from '../../../i18n/utils/get-active-locale.util';
import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { buildLocalizedPagePath } from '../../utils/build-localized-page-path.util';
import { localizePageMetadata } from '../../utils/localize-page-metadata.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    metadata: Pick<PageMetadataInterface, 'path' | 'title' | 'translations'>;
    items: ReadonlyArray<Pick<PageMetadataInterface, 'path' | 'title' | 'translations'>>;
}

export const ItemListSchema = ({ items, metadata }: Props) => {
    const locale = getActiveLocale();
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'CollectionPage',
        name: localizePageMetadata(metadata, locale).title,
        url: buildLocaleUrl(DEFAULT_LOCALE, buildLocalizedPagePath(metadata)),
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: localizePageMetadata(item, locale).title,
                url: buildLocaleUrl(DEFAULT_LOCALE, buildLocalizedPagePath(item))
            }))
        }
    };

    return <JsonLd data={schema} />;
};
