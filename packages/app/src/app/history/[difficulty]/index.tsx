import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { Page } from '../../../@generic/components/page/page';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { HistoryGamesScreen } from '../../../screens/components/history-games-screen/history-games.screen';

export default function HistoryGamesPage() {
    const { difficulty } = useLocalSearchParams<{ difficulty: DifficultyEnum }>();

    const { t } = useLingui();

    if (!Object.values(DifficultyEnum).includes(difficulty)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page>
            <PageHeader title={t`Game Replay`} />

            <HistoryGamesScreen difficulty={difficulty} />
        </Page>
    );
}
