import { i18n } from '@lingui/core';
import { getLocales } from 'expo-localization';

import { isNotEmptyString } from '@rnw-community/shared';

import { messages as deMessages } from '../../locales/de/messages';
import { messages as enMessages } from '../../locales/en/messages';
import { messages as esMessages } from '../../locales/es/messages';
import { messages as frMessages } from '../../locales/fr/messages';
import { messages as ukMessages } from '../../locales/uk/messages';
import { Languages } from '../../settings/constant/languages.constant';

import type { SettingsState } from '../../settings/store/settings.state';

i18n.load({
    en: enMessages,
    fr: frMessages,
    uk: ukMessages,
    de: deMessages,
    es: esMessages
});

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
