import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { i18nGetOSLocale } from './i18n.util';

import type { Locale } from 'expo-localization';

let mockLocales: Partial<Locale>[] = [];

jest.mock('expo-localization', () => ({
    getLocales: () => mockLocales
}));

describe('i18nGetOSLocale', () => {
    beforeEach(() => {
        mockLocales = [];
    });

    it('should use the first supported OS language', () => {
        expect.assertions(1);

        mockLocales = [{ languageCode: 'DE' }];

        expect(i18nGetOSLocale()).toBe('de');
    });

    it('should skip unsupported languages', () => {
        expect.assertions(1);

        mockLocales = [{ languageCode: 'kl' }, { languageCode: 'uk' }];

        expect(i18nGetOSLocale()).toBe('uk');
    });

    it('should fall back to english for a device without a language', () => {
        expect.assertions(2);

        expect(i18nGetOSLocale()).toBe('en');

        mockLocales = [{ languageCode: null }];

        expect(i18nGetOSLocale()).toBe('en');
    });
});
