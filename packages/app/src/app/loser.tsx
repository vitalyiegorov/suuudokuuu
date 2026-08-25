import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { LoserScreen } from '../screens/components/loser-screen/loser.screen';

export default function LoserPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead noIndex />
            <PageHeader title={t`Better luck next time!`} />

            <LoserScreen />
        </Page>
    );
}
