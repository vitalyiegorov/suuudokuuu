import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PauseScreen } from '../screens/components/pause-screen/pause.screen';

export default function PausePage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Game paused`} />

            <PauseScreen />
        </Page>
    );
}
