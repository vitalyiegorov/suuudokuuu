import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { createAppTestStore } from './create-app-test-store.mock';

import type { SettingsState } from '../../settings/store/settings.state';
import type { ReactElement } from 'react';

export const renderWithAppStore = async (ui: ReactElement, settings: Partial<SettingsState> = {}) => {
    const store = createAppTestStore({ settings });

    await render(
        <Provider store={store}>
            <I18nProvider i18n={i18n}>{ui}</I18nProvider>
        </Provider>
    );

    return store;
};
