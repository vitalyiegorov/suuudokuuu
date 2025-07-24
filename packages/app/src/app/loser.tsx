import { useLingui } from '@lingui/react/macro';

import { Page } from '../@generic/components/page/page';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { LoserScreen } from '../screens/components/loser-screen/loser.screen';

export default function LoserPage() {
    const { t } = useLingui();

    return (
        <Page>
            <PageHeader title={t`Looooooser! =)`} />

            <LoserScreen />
        </Page>
    );
}
