import { useLingui } from '@lingui/react/macro';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { PageHorizontalSafeAreaEdges } from '../../../@generic/components/page/constant/page-safe-area-edges.constant';
import { Page } from '../../../@generic/components/page/page';
import { isDifficulty } from '../../../@generic/type-guard/is-difficulty.type-guard';
import { HistoryGamesScreen } from '../../../screens/components/history-games-screen/history-games.screen';

export default function HistoryGamesPage() {
    const { difficulty } = useLocalSearchParams<{ difficulty: string | string[] }>();

    const { t } = useLingui();

    if (Array.isArray(difficulty) || !isDifficulty(difficulty)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page edges={PageHorizontalSafeAreaEdges}>
            <PageHeader title={t`Games`} />

            <HistoryGamesScreen difficulty={difficulty} />
        </Page>
    );
}
