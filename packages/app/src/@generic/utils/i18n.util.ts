import './i18n-plural-rules.polyfill';
import { Languages } from '@suuudokuuu/progress';
import { getLocales } from 'expo-localization';

import { isNotEmptyString } from '@rnw-community/shared';

import type { SettingsType } from '@suuudokuuu/progress';

export const i18nGetOSLocale = (): SettingsType['language'] => {
    const locales = getLocales();

    for (const locale of locales) {
        const languageCode = locale.languageCode?.toLowerCase() as SettingsType['language'];

        if (isNotEmptyString(languageCode) && Languages.includes(languageCode)) {
            return languageCode;
        }
    }

    return 'en';
};
