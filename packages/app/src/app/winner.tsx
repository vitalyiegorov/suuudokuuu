import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { WinnerScreen } from '../screens/components/winner-screen/winner.screen';

export default function WinnerPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Winners-winner, chicken dinner!`} />

            <WinnerScreen />
        </Page>
    );
}
