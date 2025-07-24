import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { WinnerScreen } from '../screens/components/winner-screen/winner.screen';

export default function WinnerPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Winners-winner, chicken dinner!`} />

            <WinnerScreen />
        </Page>
    );
}
