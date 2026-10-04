import { useLingui } from '@lingui/react/macro';

import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../../@generic/components/page/page';
import { SettingsScreen } from '../../../screens/components/settings-screen/settings.screen';

export const SettingsPageContent = () => {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Settings`} />

            <SettingsScreen />
        </Page>
    );
};
