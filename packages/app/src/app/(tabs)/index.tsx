import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../@generic/components/page/page';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { HomeScreen } from '../../screens/components/home-screen/home.screen';

export default function HomePage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Play`} />

            <HomeScreen />
        </Page>
    );
}
