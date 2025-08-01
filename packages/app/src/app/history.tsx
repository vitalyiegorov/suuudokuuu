import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { HistoryScreen } from '../screens/components/history-screen/history.screen';

export default function HistoryPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Statistics`} />

            <HistoryScreen />
        </Page>
    );
}
