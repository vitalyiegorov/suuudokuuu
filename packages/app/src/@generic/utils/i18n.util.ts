import './i18n-plural-rules.polyfill';

import { i18n } from '@lingui/core';
import { getLocales } from 'expo-localization';

import { isNotEmptyString } from '@rnw-community/shared';

import { messages as arMessages } from '../../i18n/locales/ar/messages';
import { messages as bnMessages } from '../../i18n/locales/bn/messages';
import { messages as deMessages } from '../../i18n/locales/de/messages';
import { messages as enMessages } from '../../i18n/locales/en/messages';
import { messages as esMessages } from '../../i18n/locales/es/messages';
import { messages as frMessages } from '../../i18n/locales/fr/messages';
import { messages as hiMessages } from '../../i18n/locales/hi/messages';
import { messages as idMessages } from '../../i18n/locales/id/messages';
import { messages as ptMessages } from '../../i18n/locales/pt/messages';
import { messages as svMessages } from '../../i18n/locales/sv/messages';
import { messages as ukMessages } from '../../i18n/locales/uk/messages';
import { messages as urMessages } from '../../i18n/locales/ur/messages';
import { messages as zhMessages } from '../../i18n/locales/zh/messages';
import { Languages } from '../../settings/constant/languages.constant';

import type { SettingsState } from '../../settings/store/settings.state';

i18n.load({
    en: enMessages,
    fr: frMessages,
    uk: ukMessages,
    de: deMessages,
    es: esMessages,
    sv: svMessages,
    zh: zhMessages,
    hi: hiMessages,
    ar: arMessages,
    bn: bnMessages,
    pt: ptMessages,
    id: idMessages,
    ur: urMessages
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
