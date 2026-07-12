import { lstatSync } from 'fs';
import { defineConfig } from '@lingui/cli';
import babelExtractorModule from '@lingui/cli/api/extractors/babel';
import { formatter } from '@lingui/format-po';

const babelExtractor = babelExtractorModule.default ?? babelExtractorModule;

const isDirectoryPath = filename => {
    try {
        return lstatSync(filename).isDirectory();
    } catch {
        return false;
    }
};

export default defineConfig({
    sourceLocale: 'en',
    locales: ['uk', 'en', 'fr', 'de', 'es', 'sv', 'zh', 'hi', 'ar', 'bn', 'pt', 'id', 'ur'],
    format: formatter({ lineNumbers: false }),
    extractors: [
        {
            match(filename) {
                if (isDirectoryPath(filename)) {
                    return false;
                }

                return babelExtractor.match(filename);
            },
            extract: babelExtractor.extract.bind(babelExtractor)
        }
    ],
    catalogs: [
        {
            path: '<rootDir>/src/i18n/locales/{locale}/messages',
            include: ['src']
        }
    ]
});
