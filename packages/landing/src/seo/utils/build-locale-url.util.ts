import { SITE_ORIGIN } from '../constants/site.constant';

import { buildLocalePath } from './build-locale-path.util';

export const buildLocaleUrl = (locale: string, path: string): string => `${SITE_ORIGIN}${buildLocalePath(locale, path)}`;
