import { messages as arabicClientMessages } from '../locales/ar/client/messages';
import { messages as bengaliClientMessages } from '../locales/bn/client/messages';
import { messages as germanClientMessages } from '../locales/de/client/messages';
import { messages as englishClientMessages } from '../locales/en/client/messages';
import { messages as spanishClientMessages } from '../locales/es/client/messages';
import { messages as frenchClientMessages } from '../locales/fr/client/messages';
import { messages as hindiClientMessages } from '../locales/hi/client/messages';
import { messages as indonesianClientMessages } from '../locales/id/client/messages';
import { messages as brazilianPortugueseClientMessages } from '../locales/pt-BR/client/messages';
import { messages as swedishClientMessages } from '../locales/sv/client/messages';
import { messages as ukrainianClientMessages } from '../locales/uk/client/messages';
import { messages as urduClientMessages } from '../locales/ur/client/messages';
import { messages as chineseClientMessages } from '../locales/zh/client/messages';

import type { LocaleType } from '../../seo/types/locale.type';
import type { Messages } from '@lingui/core';

export const CLIENT_MESSAGES: Readonly<Record<LocaleType, Messages>> = {
    en: englishClientMessages,
    ar: arabicClientMessages,
    bn: bengaliClientMessages,
    de: germanClientMessages,
    es: spanishClientMessages,
    fr: frenchClientMessages,
    hi: hindiClientMessages,
    id: indonesianClientMessages,
    'pt-BR': brazilianPortugueseClientMessages,
    sv: swedishClientMessages,
    uk: ukrainianClientMessages,
    ur: urduClientMessages,
    zh: chineseClientMessages
};
