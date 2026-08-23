import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { DEFAULT_LOCALE } from '../../constants/site.constant';
import { buildLocaleUrl } from '../../utils/build-locale-url.util';
import { JsonLd } from '../json-ld/json-ld';

import type { PageMetadataInterface } from '../../interfaces/page-metadata.interface';

interface Props {
    metadata: Pick<PageMetadataInterface, 'path' | 'title'>;
    items: ReadonlyArray<Pick<PageMetadataInterface, 'path' | 'title'>>;
}

export const ItemListSchema = ({ items, metadata }: Props) => {
    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'CollectionPage',
        name: metadata.title,
        url: buildLocaleUrl(DEFAULT_LOCALE, metadata.path),
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: items.length,
            itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.title,
                url: buildLocaleUrl(DEFAULT_LOCALE, item.path)
            }))
        }
    };

    return <JsonLd data={schema} />;
};
