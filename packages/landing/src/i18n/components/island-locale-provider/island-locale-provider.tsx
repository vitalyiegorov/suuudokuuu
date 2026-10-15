import { CLIENT_MESSAGES } from '../../constants/client-messages.constant';
import { getActiveLocale } from '../../utils/get-active-locale.util';
import { LocaleProvider } from '../locale-provider/locale-provider';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const IslandLocaleProvider = ({ children }: Props) => {
    const locale = getActiveLocale();

    return (
        <LocaleProvider locale={locale} messages={CLIENT_MESSAGES[locale]}>
            {children}
        </LocaleProvider>
    );
};
