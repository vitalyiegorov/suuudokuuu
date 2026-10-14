'use client';

import { setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { useState } from 'react';

import type { Messages } from '@lingui/core';
import type { ReactNode } from 'react';

interface Props {
    locale: string;
    messages: Messages;
    children: ReactNode;
}

export const LocaleProvider = ({ children, locale, messages }: Props) => {
    const [i18n] = useState(() => setupI18n({ locale, messages: { [locale]: messages } }));

    return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};
