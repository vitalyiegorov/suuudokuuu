import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function PausePage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHead noIndex />
            <PageHeader title={t`Game paused`} />

            <PauseScreen />
        </Page>
    );
}
