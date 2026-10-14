import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './src/seo/constants/site.constant';

export default defineConfig({
    sourceLocale: DEFAULT_LOCALE,
    locales: [...SUPPORTED_LOCALES],
    format: formatter({ lineNumbers: false }),
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}/messages',
            include: ['<rootDir>/src']
        }
    ]
});
