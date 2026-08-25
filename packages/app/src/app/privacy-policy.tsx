import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PrivacyPolicyScreen } from '../screens/components/privacy-policy-screen/privacy-policy.screen';

export default function PrivacyPolicyPage() {
    const { t } = useLingui();
    const description = t`Read the Suuudokuuu privacy policy covering data collection, storage, and your rights.`;

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead description={description} title={t`Privacy Policy — Suuudokuuu`} />
            <PageHeader title={t`Privacy policy`} />

            <PrivacyPolicyScreen />
        </Page>
    );
}
