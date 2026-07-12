import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { ScoringScreen } from '../scoring/components/scoring.screen';

export default function ScoringPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`How Scoring Works`} />

            <ScoringScreen />
        </Page>
    );
}
