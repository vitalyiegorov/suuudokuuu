import { DEFAULT_LOCALE } from '../constants/site.constant';

import { buildLanguageAlternates } from './build-language-alternates.util';
import { buildLocaleUrl } from './build-locale-url.util';

import type { PageAlternatesInterface } from '../interfaces/page-alternates.interface';

export const buildAlternates = (path: string): PageAlternatesInterface => ({
    canonical: buildLocaleUrl(DEFAULT_LOCALE, path),
    languages: buildLanguageAlternates(path)
});
