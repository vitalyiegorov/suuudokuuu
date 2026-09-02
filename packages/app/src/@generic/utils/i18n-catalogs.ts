import { i18n } from '@lingui/core';

import { emptyFn } from '@rnw-community/shared';

import { messages as enMessages } from '../../i18n/locales/en/messages';

import type { SettingsState } from '../../settings/store/settings.state';

const catalogLoaders: Record<SettingsState['language'], () => Promise<{ messages: typeof enMessages }>> = {
    ar: () => import('../../i18n/locales/ar/messages'),
    bn: () => import('../../i18n/locales/bn/messages'),
    de: () => import('../../i18n/locales/de/messages'),
    en: () => import('../../i18n/locales/en/messages'),
    es: () => import('../../i18n/locales/es/messages'),
    fr: () => import('../../i18n/locales/fr/messages'),
    hi: () => import('../../i18n/locales/hi/messages'),
    id: () => import('../../i18n/locales/id/messages'),
    pt: () => import('../../i18n/locales/pt/messages'),
    sv: () => import('../../i18n/locales/sv/messages'),
    uk: () => import('../../i18n/locales/uk/messages'),
    ur: () => import('../../i18n/locales/ur/messages'),
    zh: () => import('../../i18n/locales/zh/messages')
};

i18n.load({ en: enMessages });
i18n.activate('en');

export const i18nActivateLanguage = (language: SettingsState['language']): Promise<void> =>
    catalogLoaders[language]()
        .then(({ messages }) => void i18n.loadAndActivate({ locale: language, messages }))
        .catch(emptyFn);
