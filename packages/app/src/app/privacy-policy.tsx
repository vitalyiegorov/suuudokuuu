import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PrivacyPolicyScreen } from '../screens/components/privacy-policy-screen/privacy-policy.screen';

export default function PrivacyPolicyPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Privacy policy`} />

            <PrivacyPolicyScreen />
        </Page>
    );
}
