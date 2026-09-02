import './i18n-plural-rules.polyfill';

import { getLocales } from 'expo-localization';

import { isNotEmptyString } from '@rnw-community/shared';

import { Languages } from '../../settings/constant/languages.constant';

import type { SettingsState } from '../../settings/store/settings.state';

export const i18nGetOSLocale = (): SettingsState['language'] => {
    const locales = getLocales();

    for (const locale of locales) {
        const languageCode = locale.languageCode?.toLowerCase() as SettingsState['language'];

        if (isNotEmptyString(languageCode) && Languages.includes(languageCode)) {
            return languageCode;
        }
    }

    return 'en';
};
