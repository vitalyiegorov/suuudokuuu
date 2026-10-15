import { messages as englishClientMessages } from '../locales/en/client/messages';
import { messages as spanishClientMessages } from '../locales/es/client/messages';

import type { LocaleType } from '../../seo/types/locale.type';
import type { Messages } from '@lingui/core';

export const CLIENT_MESSAGES: Readonly<Record<LocaleType, Messages>> = {
    en: englishClientMessages,
    es: spanishClientMessages
};
