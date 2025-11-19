import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { ScoringScreen } from '../screens/components/scoring-screen/scoring.screen';

export default function ScoringPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`How Scoring Works`} />

            <ScoringScreen />
        </Page>
    );
}
