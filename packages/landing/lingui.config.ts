import { defineConfig } from '@lingui/cli';
import { formatter } from '@lingui/format-po';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './src/seo/constants/site.constant';

const CLIENT_MESSAGE_SOURCES = [
    '<rootDir>/src/difficulty/components/difficulty-live-board/difficulty-live-board.tsx',
    '<rootDir>/src/techniques/utils/build-field-labels.util.ts'
];

export default defineConfig({
    sourceLocale: DEFAULT_LOCALE,
    locales: [...SUPPORTED_LOCALES],
    format: formatter({ lineNumbers: false }),
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}/messages',
            include: ['<rootDir>/src'],
            exclude: CLIENT_MESSAGE_SOURCES
        },
        {
            path: '<rootDir>/src/i18n/locales/{locale}/client/messages',
            include: CLIENT_MESSAGE_SOURCES
        }
    ]
});
