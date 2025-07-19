import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PrivacyPolicyScreen } from '../screens/components/privacy-policy-screen/privacy-policy.screen';

export default function PrivacyPolicyPage() {
    return (
        <Page>
            <PageHeader title="Privacy policy" />
            <PrivacyPolicyScreen />
        </Page>
    );
}
