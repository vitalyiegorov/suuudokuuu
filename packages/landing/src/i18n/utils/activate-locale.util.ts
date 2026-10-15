import { setupI18n } from '@lingui/core';
import { setI18n } from '@lingui/react/server';

import { messages as arabicMessages } from '../locales/ar/messages';
import { messages as bengaliMessages } from '../locales/bn/messages';
import { messages as germanMessages } from '../locales/de/messages';
import { messages as englishMessages } from '../locales/en/messages';
import { messages as spanishMessages } from '../locales/es/messages';
import { messages as frenchMessages } from '../locales/fr/messages';
import { messages as hindiMessages } from '../locales/hi/messages';
import { messages as indonesianMessages } from '../locales/id/messages';
import { messages as brazilianPortugueseMessages } from '../locales/pt-BR/messages';
import { messages as swedishMessages } from '../locales/sv/messages';
import { messages as ukrainianMessages } from '../locales/uk/messages';
import { messages as urduMessages } from '../locales/ur/messages';
import { messages as chineseMessages } from '../locales/zh/messages';

import type { LocaleType } from '../../seo/types/locale.type';
import type { Messages } from '@lingui/core';

const LOCALE_MESSAGES: Readonly<Record<LocaleType, Messages>> = {
    en: englishMessages,
    ar: arabicMessages,
    bn: bengaliMessages,
    de: germanMessages,
    es: spanishMessages,
    fr: frenchMessages,
    hi: hindiMessages,
    id: indonesianMessages,
    'pt-BR': brazilianPortugueseMessages,
    sv: swedishMessages,
    uk: ukrainianMessages,
    ur: urduMessages,
    zh: chineseMessages
};

export const activateLocale = (locale: LocaleType): void => {
    setI18n(setupI18n({ locale, messages: { [locale]: LOCALE_MESSAGES[locale] } }));
};
