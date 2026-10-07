import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';

import { LayoutDirectionView } from '../layout-direction-view/layout-direction-view';
import { LinguiDefaultComponent } from '../lingui-default-component/lingui-default-component';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const AppI18nProvider = ({ children }: Props) => (
    <I18nProvider i18n={i18n} defaultComponent={LinguiDefaultComponent}>
        <LayoutDirectionView>{children}</LayoutDirectionView>
    </I18nProvider>
);
