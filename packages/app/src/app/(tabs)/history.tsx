import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../@generic/components/page/page';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { HistoryScreen } from '../../screens/components/history-screen/history.screen';

export default function HistoryPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Stats`} />

            <HistoryScreen />
        </Page>
    );
}
