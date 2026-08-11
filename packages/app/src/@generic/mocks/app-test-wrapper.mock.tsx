import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Provider } from 'react-redux';

import { createAppTestStore } from '../utils/create-app-test-store.mock';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

const appTestStore = createAppTestStore();

export const AppTestWrapper = ({ children }: Props) => (
    <Provider store={appTestStore}>
        <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </Provider>
);
