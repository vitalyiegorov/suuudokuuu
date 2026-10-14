import { useLingui } from '@lingui/react/macro';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../../../seo/constants/site.constant';
import { messages as englishClientMessages } from '../../locales/en/client/messages';
import { messages as spanishClientMessages } from '../../locales/es/client/messages';
import { LocaleProvider } from '../locale-provider/locale-provider';

import type { LocaleType } from '../../../seo/types/locale.type';
import type { Messages } from '@lingui/core';
import type { ReactNode } from 'react';

const CLIENT_MESSAGES: Readonly<Record<LocaleType, Messages>> = {
    en: englishClientMessages,
    es: spanishClientMessages
};

interface Props {
    children: ReactNode;
}

export const IslandLocaleProvider = ({ children }: Props) => {
    const { i18n } = useLingui();
    const locale = SUPPORTED_LOCALES.find(supportedLocale => supportedLocale === i18n.locale) ?? DEFAULT_LOCALE;

    return (
        <LocaleProvider locale={locale} messages={CLIENT_MESSAGES[locale]}>
            {children}
        </LocaleProvider>
    );
};
