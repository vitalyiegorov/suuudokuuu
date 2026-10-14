import { PAGE_METADATA_REGISTRY } from '../../seo/registries/page-metadata.registry';
import { buildLocaleUrl } from '../../seo/utils/build-locale-url.util';
import { getPageLocales } from '../../seo/utils/get-page-locales.util';
import { localizePageMetadata } from '../../seo/utils/localize-page-metadata.util';

import type { IndexablePageInterface } from '../interfaces/indexable-page.interface';

export const buildIndexablePages = (): IndexablePageInterface[] =>
    PAGE_METADATA_REGISTRY.flatMap(pageMetadata =>
        getPageLocales(pageMetadata).map(locale => ({
            url: buildLocaleUrl(locale, pageMetadata.path),
            locale,
            pageMetadata: localizePageMetadata(pageMetadata, locale)
        }))
    );
