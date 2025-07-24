import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PrivacyPolicyScreen } from '../screens/components/privacy-policy-screen/privacy-policy.screen';

export default function PrivacyPolicyPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Privacy policy`} />

            <PrivacyPolicyScreen />
        </Page>
    );
}
