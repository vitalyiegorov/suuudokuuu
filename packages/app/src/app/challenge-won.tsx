import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { ChallengeWonScreen } from '../screens/components/challenge-won-screen/challenge-won-screen';

export default function ChallengeWonPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Challenge Won!`} />

            <ChallengeWonScreen />
        </Page>
    );
}
