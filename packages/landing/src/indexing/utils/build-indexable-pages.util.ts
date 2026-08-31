import { SUPPORTED_LOCALES } from '../../seo/constants/site.constant';
import { PAGE_METADATA_REGISTRY } from '../../seo/registries/page-metadata.registry';
import { buildLocaleUrl } from '../../seo/utils/build-locale-url.util';

import type { IndexablePageInterface } from '../interfaces/indexable-page.interface';

export const buildIndexablePages = (): IndexablePageInterface[] =>
    PAGE_METADATA_REGISTRY.flatMap(pageMetadata =>
        SUPPORTED_LOCALES.map(locale => ({ url: buildLocaleUrl(locale, pageMetadata.path), locale, pageMetadata }))
    );
