import { DEFAULT_LOCALE } from '../constants/site.constant';

import { buildLanguageAlternates } from './build-language-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';

interface PageAlternatesInterface {
    readonly canonical: string;
    readonly languages: Readonly<Record<string, string>>;
}

export const buildAlternates = (path: string): PageAlternatesInterface => ({
    canonical: buildLocaleUrl(DEFAULT_LOCALE, path),
    languages: buildLanguageAlternates(path)
});
