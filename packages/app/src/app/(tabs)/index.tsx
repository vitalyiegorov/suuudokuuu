import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../@generic/components/page/page';
import { PageHead } from '../../@generic/components/page-head/page-head';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { HomeScreen } from '../../screens/components/home-screen/home.screen';

export default function HomePage() {
    const { t } = useLingui();
    const description = t`Play free Sudoku online with six difficulty levels, hints, and no ads. Fast, distraction-free puzzles in your browser.`;

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead description={description} title={t`Suuudokuuu — Free Online Sudoku, No Ads`} />
            <PageHeader title={t`Play`} />

            <HomeScreen />
        </Page>
    );
}
