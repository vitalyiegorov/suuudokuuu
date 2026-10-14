import { buildLanguageAlternates } from './build-language-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';
import type { LocaleType } from '../types/locale.type';

interface PageAlternatesInterface {
    readonly canonical: string;
    readonly languages: Readonly<Record<string, string>>;
}

export const buildAlternates = (
    pageMetadata: Pick<PageMetadataInterface, 'path' | 'translations'>,
    locale: LocaleType
): PageAlternatesInterface => ({
    canonical: buildLocaleUrl(locale, pageMetadata.path),
    languages: buildLanguageAlternates(pageMetadata)
});
