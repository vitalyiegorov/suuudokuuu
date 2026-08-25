import { useLingui } from '@lingui/react/macro';

import { PageHorizontalSafeAreaEdges } from '../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../@generic/components/page/page';
import { PageHead } from '../../@generic/components/page-head/page-head';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { HistoryScreen } from '../../screens/components/history-screen/history.screen';

export default function HistoryPage() {
    const { t } = useLingui();
    const description = t`Track your solved Sudoku puzzles, best times, and scores across every difficulty.`;

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHead description={description} title={t`Your Sudoku Stats — Suuudokuuu`} />
            <PageHeader title={t`Stats`} />

            <HistoryScreen />
        </Page>
    );
}
