import { useLingui } from '@lingui/react/macro';

import { PageHead } from '../@generic/components/page-head/page-head';
import { PageHeader } from '../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../@generic/components/page/page';
import { HomeScreen } from '../screens/components/home-screen/home.screen';

export default function PlayPage() {
    const { t } = useLingui();

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead isNoIndex title={t`Play Sudoku — Suuudokuuu`} />
            <PageHeader title={t`Play`} />

            <HomeScreen />
        </Page>
    );
}
