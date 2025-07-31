import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { SettingsScreen } from '../screens/components/settings-screen/settings.screen';

export default function SettingsPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Settings`} />

            <SettingsScreen />
        </Page>
    );
}
