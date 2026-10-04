import { useLingui } from '@lingui/react/macro';

import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { WinnerScreen } from '../screens/components/winner-screen/winner.screen';

export default function WinnerPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead noIndex />
            <PageHeader title={t`Winners-winner, chicken dinner!`} />

            <WinnerScreen />
        </Page>
    );
}
