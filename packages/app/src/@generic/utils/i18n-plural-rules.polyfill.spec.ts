import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { Languages } from '../../settings/constant/languages.constant';

const OriginalPluralRules = Intl.PluralRules;
const pluralRulesPropertyName = OriginalPluralRules.name;

describe('i18n plural rules polyfill', () => {
    beforeEach(() => {
        jest.resetModules();
        Reflect.deleteProperty(Intl, pluralRulesPropertyName);
    });

    afterEach(() => {
        Object.defineProperty(Intl, pluralRulesPropertyName, {
            configurable: true,
            value: OriginalPluralRules,
            writable: true
        });
    });

    it('loads plural rules for every supported language', () => {
        jest.isolateModules(() => {
            jest.requireActual('./i18n-plural-rules.polyfill');
        });

        for (const language of Languages) {
            const pluralRules = new Intl.PluralRules(language);

            expect(pluralRules.select(1)).toEqual(expect.any(String));
        }
    });
});
