import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { Redirect, useLocalSearchParams } from 'expo-router';

import { Page } from '../../../@generic/components/page/page';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ReplayScreen } from '../../../screens/components/replay-screen/replay.screen';

export default function ReplayGamePage() {
    const { t } = useLingui();
    const { difficulty = '', completedAt = '' } = useLocalSearchParams<{ difficulty?: string; completedAt?: string }>();

    const difficultyEnum = difficulty as DifficultyEnum;
    const completedAtNumber = parseInt(completedAt, 10);

    if (!Object.values(DifficultyEnum).includes(difficultyEnum) || isNaN(completedAtNumber)) {
        return <Redirect href="/history" />;
    }

    return (
        <Page>
            <PageHeader title={t`Game Replay`} />

            <ReplayScreen completedAt={completedAtNumber} difficulty={difficultyEnum} />
        </Page>
    );
}
