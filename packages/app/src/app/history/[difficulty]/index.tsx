import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { isDefined } from '@rnw-community/shared';

import { Page } from '../../../@generic/components/page/page';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { HistoryGamesScreen } from '../../../screens/components/history-games-screen/history-games.screen';

const DifficultyValues = Object.values(DifficultyEnum);

const isValidDifficulty = (difficulty: string | undefined): difficulty is DifficultyEnum =>
    isDefined(difficulty) && DifficultyValues.includes(difficulty as DifficultyEnum);

export default function HistoryGamesRoute() {
    const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
    const { t } = useLingui();

    if (!isValidDifficulty(difficulty)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page>
            <PageHeader title={t`Game Replay`} />

            <HistoryGamesScreen difficulty={difficulty} />
        </Page>
    );
}
