import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { SharedScreen } from '../screens/components/shared-screen/shared-screen';

export default function SharedPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Open shared puzzle?`} />

            <SharedScreen />
        </Page>
    );
}
