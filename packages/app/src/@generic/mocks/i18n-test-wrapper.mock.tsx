import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const I18nTestWrapper = ({ children }: Props) => <I18nProvider i18n={i18n}>{children}</I18nProvider>;
