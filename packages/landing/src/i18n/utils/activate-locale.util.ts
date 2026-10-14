import { setupI18n } from '@lingui/core';
import { setI18n } from '@lingui/react/server';

import { messages as englishMessages } from '../locales/en/messages';
import { messages as spanishMessages } from '../locales/es/messages';

import type { LocaleType } from '../../seo/types/locale.type';
import type { Messages } from '@lingui/core';

const LOCALE_MESSAGES: Readonly<Record<LocaleType, Messages>> = {
    en: englishMessages,
    es: spanishMessages
};

export const activateLocale = (locale: LocaleType): void => {
    setI18n(setupI18n({ locale, messages: { [locale]: LOCALE_MESSAGES[locale] } }));
};
