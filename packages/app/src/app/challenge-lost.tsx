import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { ChallengeLostScreen } from '../screens/components/challenge-lost-screen/challenge-lost-screen';

export default function ChallengeLostPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Challenge Lost`} />

            <ChallengeLostScreen />
        </Page>
    );
}
